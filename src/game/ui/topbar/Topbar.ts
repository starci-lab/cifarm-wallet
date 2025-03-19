import { UserSchema } from "@/modules/entities"
import { BaseAssetKey } from "../../assets"
import { ResourceLabel, Text, TextColor } from "../elements"
import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseSizerBaseConstructorParams, CacheKey } from "@/game/types"
import { EventBus, EventName, ModalName } from "@/game/event-bus"
import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer"
import { truncateString } from "@/modules/common"
import { loadImageAwait, loadSvgAwait } from "../utils"
import { createJazziconBlobUrl } from "@/modules/jazz"
import Button from "phaser3-rex-plugins/plugins/button"

export class Topbar extends BaseSizer {
    private background: Phaser.GameObjects.Image
    private user: UserSchema
    private profileContainer: Sizer | undefined
    private resourcesContainer: Sizer | undefined
    private energyLabel: Label | undefined
    private tokenLabel: Label | undefined
    private goldLabel: Label | undefined
    private visited: boolean = false
    private neighbor: UserSchema | undefined
    constructor({
        scene,
        x,
        y,
        width,
        height,
    }: BaseSizerBaseConstructorParams) {
        const background = scene.add
            .image(0, 0, BaseAssetKey.UITopbarHeader)
            .setOrigin(0.5, 0)
        super(scene, x, y, width || background.width, height || background.height)
        this.background = background
        this.addLocal(background)

        this.user = this.scene.cache.obj.get(CacheKey.User)

        EventBus.on(EventName.UserRefreshed, (user: UserSchema) => {
            this.user = user
            this.updateContent()
        })

        EventBus.on(EventName.EnergySynced, (energy: number) => {
            this.user.energy = energy
            this.updateContent()
        })

        EventBus.on(EventName.Visit, async () => {
            this.neighbor = this.scene.cache.obj.get(CacheKey.VisitedNeighbor)
            this.visited = true
            await this.loadAvatar()
            this.updateContent()
            EventBus.emit(EventName.HideButtons)
            EventBus.emit(EventName.ShowNeighborButtons)
        })

        EventBus.on(EventName.Return, () => {
            this.neighbor = undefined
            this.visited = false
            this.scene.cache.obj.add(CacheKey.VisitedNeighbor, undefined)
            this.updateContent()
            EventBus.emit(EventName.ShowButtons)
            EventBus.emit(EventName.HideNeighborButtons)
        })

        const visitedNeighbor = this.scene.cache.obj.get(CacheKey.VisitedNeighbor)
        if (visitedNeighbor) {
            this.visited = true
            this.neighbor = visitedNeighbor
            this.updateContent()
        }

        this.updateContent()

        EventBus.on(EventName.HideTopbar,  () => {
            this.setVisible(false).setActive(false)
        })

        EventBus.on(EventName.ShowTopbar,  () => {
            this.setVisible(true).setActive(true)
        })
    }

    private updateContent() {
        this.updateProfileContainer()
        this.updateResourcesContainer()
    }

    private async loadAvatar() {
        
        const user = this.visited ? this.neighbor : this.user
        if (!user) {
            throw new Error("User not found")
        }
        //check if image id is already loaded
        if (this.scene.textures.exists(user.id)) {
            return
        }
        if (user.avatarUrl) {
            await loadImageAwait({
                scene: this.scene,
                key: user.id,
                imageUrl: user.avatarUrl
            })
        } else {
            await loadSvgAwait({
                scene: this.scene,
                key: user.id,
                scale: 16,
                svgUrl: createJazziconBlobUrl(user.accountAddress)
            })
        }
    }

    private updateProfileContainer() {
        if (this.profileContainer) {
            this.remove(this.profileContainer, true)
        }
        const user = this.visited ? this.neighbor : this.user
        if (!user) {
            throw new Error("User not found")
        }
        const nameBackground = this.scene.add.image(0, 0, BaseAssetKey.UITopbarName)
        const nameText = new Text({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 0,
                text: truncateString(user.username, 10, 0),
            },
            options: {
                fontSize: 24,
                textColor: TextColor.White,
            },
        })
        this.scene.add.existing(nameText)
        const name = this.scene.rexUI.add.label({
            text: nameText,
            align: "left",
            space: {
                left: 50,
                top: -2
            },
            background: nameBackground,
            width: nameBackground.width,
            height: nameBackground.height,
        })
        const avatarWrapperBackground = this.scene.add.image(0, 0, BaseAssetKey.UITopbarAvatarWrapper)
        const avatarImage = this.scene.add.image(0, 0, BaseAssetKey.UITopbarAvatar)
        const avatarMask = this.scene.add.image(0, 0, BaseAssetKey.UITopbarAvatarMask).setVisible(false)
        const image = this.scene.add.image(0, 0, user.id).setDisplaySize(avatarMask.width, avatarMask.height)
        image.setMask(avatarMask.createBitmapMask())
        const imageWithMask = this.scene.rexUI.add.label({
            background: avatarMask,
            icon: image,
            width: avatarMask.width,
            height: avatarMask.height,
            align: "center",
        }).layout()
        const avatarSizer = this.scene.rexUI.add.overlapSizer({
            height: avatarImage.height,
            width: avatarImage.width,
        }).addBackground(avatarImage).add(imageWithMask, {
            align: "center-bottom",
            expand: false
        }).layout()
        const levelBoxImage = this.scene.add.image(0, 0, BaseAssetKey.UITopbarLevelBox)
        const levelText = new Text({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 0,
                text: `${user.level}`,
            },
            options: {
                fontSize: 24,
            }
        })
        this.scene.add.existing(levelText)
        const levelBoxLabel = this.scene.rexUI.add.label({
            background: levelBoxImage,
            text: levelText,
            width: levelBoxImage.width,
            height: levelBoxImage.height,
            align: "center",
        })
        // Left column - Avatar
        const avatar = this.scene.rexUI.add.badgeLabel({
            background: avatarWrapperBackground,
            width: avatarWrapperBackground.width,
            height: avatarWrapperBackground.height,
            rightBottom: levelBoxLabel,
            center: avatarSizer,
        }).layout()
        this.profileContainer = this.scene.rexUI.add
            .sizer({
                orientation: "x",
                originX: this.visited ? 0.5 : 0,
                originY: 0,
                x: this.visited ? 0 : (- this.background.width / 2 + 20),
            }).add(avatar).add(name, {
                align: "left-center",
                offsetY: (this.background.height / 2 - avatarWrapperBackground.height / 2),
                offsetX: -30,
            }).layout()
        this.addLocal(this.profileContainer)
        // if not visited, allow to click on the avatar to open the profile modal
        if (!this.visited) {
            const button = new Button(this.profileContainer)
            button.on("click", () => {
                EventBus.emit(EventName.OpenExternalModal, {
                    modalName: ModalName.Profile,
                })
            })
        }
        return this.profileContainer
    }

    private updateResourcesContainer() {
        if (this.resourcesContainer) {
            if (!this.goldLabel) {
                throw new Error("Gold label not found")
            } 
            if (!this.tokenLabel) {
                throw new Error("Token label not found")
            }
            if (!this.visited) {
                this.goldLabel.show()
                this.tokenLabel.show()
            } else {
                this.goldLabel.hide()
                this.tokenLabel.hide()
            }

            //update resources
            if (this.energyLabel) {
                this.energyLabel.text = `${this.user.energy}/${this.getMaxEnergy(this.user.level)}`
            }
            if (this.goldLabel) {
                this.goldLabel.text = `${this.user.golds ?? 0}`
            }
            if (this.tokenLabel) {
                this.tokenLabel.text = `${this.user.tokens ?? 0}`
            }

            this.resourcesContainer.layout()
            return
        }
        this.energyLabel = this.addLabel({
            iconKey: BaseAssetKey.UITopbarIconEnergy,
            amount: `${this.user.energy}/${this.getMaxEnergy(
                this.user.level
            )}`,
            scale: 0.8,
        })
        this.goldLabel = this.addLabel({
            iconKey: BaseAssetKey.UICommonIconCoin,
            amount: `${this.user.golds ?? 0}`,
        }).setVisible(!this.visited)
        this.tokenLabel = this.addLabel({
            iconKey: BaseAssetKey.UICommonIconCarrot,
            amount: `${this.user.tokens ?? 0}`,
            scale: 0.9,
        }).setVisible(!this.visited)
        this.resourcesContainer = this.scene.rexUI.add
            .sizer({
                x: this.background.width / 2 - 20,
                y: this.background.height / 2,
                originX: 1,
                originY: 0.5,
                orientation: "h",
            })
            .add(this.energyLabel)
            .add(this.goldLabel)
            .add(this.tokenLabel)
            .setItemSpacing(50)
            .layout()
        this.addLocal(this.resourcesContainer)
    }

    private addLabel({ iconKey, amount, scale = 1 }: AddLabelParams) {
        const resourceLabel = new ResourceLabel({
            baseParams: {
                scene: this.scene,
            },
            options: {
                iconKey,
                amount: parseInt(amount),
                scale,
            },
        })
        this.scene.add.existing(resourceLabel)
        return resourceLabel
    }

    private getMaxEnergy(level: number = 1): number {
        return 50 + (level - 1) * 3
    }
}

interface AddLabelParams {
  iconKey: BaseAssetKey;
  scale?: number;
  amount: string;
}
