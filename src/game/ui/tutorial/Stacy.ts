import { Position, TutorialStep, UserEntity } from "@/modules/entities"
import { tutorialStepMap } from "./config"
import { Label } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseAssetKey } from "@/game/assets"
import { BaseText, NinePatch3x3, TextColor } from "../elements"
import { sleep } from "@/modules/common"
import { CacheKey, ContainerLiteBaseConstructorParams } from "../../types"
import {
    EventBus,
    EventName,
    TutorialOpenInventoryResponsedMessage,
    TutorialOpenShopResponsedMessage,
    TutorialPrepareBuySeedsMessage,
    TutorialPrepareCloseShopResponsedMessage,
    TutorialWaterCanPressedMessage,
} from "../../event-bus"
import { getScreenBottomY, getScreenCenterX, getScreenTopY } from "../utils"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { calculateUiDepth, UILayer } from "../../layers"
import { getPlacedItemsWithSeedGrowthInfo } from "@/game/queries"

export class Stacy extends ContainerLite {
    private stacyImage: Phaser.GameObjects.Image
    private stacyBubble: Label
    private pressToContinueText: Phaser.GameObjects.Text
    private user: UserEntity
    private pressHereArrow: Phaser.GameObjects.Image
    private helpDialog: Label

    constructor({
        scene,
        x,
        y,
        width,
        height,
        children,
    }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)

        this.pressToContinueText = new BaseText({
            baseParams: {
                scene: this.scene,
                text: "Press to continue",
                x: getScreenCenterX(this.scene),
                y: getScreenBottomY(this.scene) - 50,
            },
        })
            .setOrigin(0.5, 1)
            .setVisible(false).setDepth(calculateUiDepth({
                layer: UILayer.Tutorial,
                layerDepth: 1
            }))
        this.scene.add.existing(this.pressToContinueText)

        // press here arrow
        this.pressHereArrow = this.scene.add
            .image(0, 0, BaseAssetKey.PressHereArrow)
            .setOrigin(0.5, 0)
            .setVisible(false)
            .setDepth(calculateUiDepth({
                layer: UILayer.Overlay,
            }))

        // stacy image
        this.stacyImage = this.scene.add
            .image(
                getScreenCenterX(this.scene),
                getScreenBottomY(this.scene) - 50,
                ""
            )
            .setOrigin(0.5, 1)
        this.add(this.stacyImage)

        // add nine patch
        const bubbleNinePatch = new NinePatch3x3({
            baseParams: {
                scene: this.scene,
            },
            options: {
                assetKey: BaseAssetKey.Bubble,
                bottomHeight: 80,
                leftWidth: 80,
                rightWidth: 80,
                topHeight: 80,
            },
        })
        this.scene.add.existing(bubbleNinePatch)
        const text = new BaseText({
            baseParams: {
                scene: this.scene,
                text: "",
                x: 0,
                y: 0,
                style: {
                    wordWrap: { width: 800 },
                },
            },
            options: {
                textColor: TextColor.Brown,
                fontSize: 48,
            },
        })
        // add the text
        this.scene.add.existing(text)
        this.stacyBubble = this.scene.rexUI.add
            .label({
                background: bubbleNinePatch,
                text,
                x: getScreenCenterX(this.scene),
                y: getScreenTopY(this.scene) + 200,
                originX: 0.5,
                originY: 0,
            })
            .setInnerPadding({
                bottom: 80,
                left: 80,
                right: 80,
                top: 80,
            })
            .setMinHeight(500)
            .setMinWidth(500)
            .layout()
        this.add(this.stacyBubble)

        const helperText = new BaseText({
            baseParams: {
                scene: this.scene,
                text: "",
                x: 0,
                y: 0,
                style: {
                    wordWrap: { width: 800 },
                },
            },
            options: {
                fontSize: 32,
                enableStroke: true,
            },
        })
        this.scene.add.existing(helperText)

        this.helpDialog = this.scene.rexUI.add.label({
            x: getScreenCenterX(this.scene),
            y: 300,
            originY: 0,
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
            text: helperText,
        }).setDepth(
            calculateUiDepth({
                layer: UILayer.Tutorial,
                layerDepth: 2,
            })
        ).layout()
        this.helpDialog.hide()

        this.user = this.scene.cache.obj.get(CacheKey.User)
    
        this.scene.events.on(
            EventName.HidePressHereArrow,
            () => {
                this.pressHereArrow?.setVisible(false)
            }
        )

        // callback when the tutorial is completed
        EventBus.on(EventName.UpdateTutorialCompleted, () => {
            EventBus.once(EventName.UserRefreshed, (user: UserEntity) => {
                // check  if the tutorial is not shown
                // set the user
                this.user = user
                // emit the event
                // we perform switch case here to know what to do next
                this.render()
            })
            EventBus.emit(EventName.RefreshUser)
        })
        
        this.hide()
    }

    // show the help dialog
    private showHelpDialog(text: string) {
        this.helpDialog.show()
        this.helpDialog.setText(text).layout()
    }

    // hide the help dialog
    private hideHelpDialog() {
        this.helpDialog.hide()
    }

    // allow the player to press to continue
    private allowPressToContinue() {
        this.pressToContinueText?.setVisible(true)
        //click anywhere to continue
        this.scene.input.once("pointerdown", () => {
            // hide the press to continue text
            this.pressToContinueText?.setVisible(false)
            switch (this.user.tutorialStep) {
            case TutorialStep.StartBuySeeds: {
                // when user press the shop button
                this.scene.events.once(
                    EventName.TutorialOpenShopResponsed,
                    ({ position }: TutorialOpenShopResponsedMessage) => {
                        this.displayPressHereArrow({
                            originPosition: { x: position.x + 60, y: position.y + 60 },
                            targetPosition: { x: position.x + 40, y: position.y + 40 },
                        })
                    }
                )
                // when user press the shop button
                this.scene.events.once(
                    EventName.TutorialPrepareBuySeeds,
                    ({ position }: TutorialPrepareBuySeedsMessage) => {
                        this.displayPressHereArrow({
                            originPosition: { x: position.x + 60, y: position.y + 60 },
                            targetPosition: { x: position.x + 40, y: position.y + 40 },
                        })
                    }
                )
                // when user prepare to close the shop
                this.scene.events.once(
                    EventName.TutorialPrepareCloseShopResponsed,
                    ({ position }: TutorialPrepareCloseShopResponsedMessage) => {
                        this.displayPressHereArrow({
                            rotation: 45,
                            originPosition: { x: position.x - 60, y: position.y + 60 },
                            targetPosition: { x: position.x - 40, y: position.y + 40 },
                        })
                    }
                )
                this.scene.events.once(EventName.TutorialCloseShopButtonPressed, () => {
                    this.scene.events.emit(EventName.HidePressHereArrow)
                    // call the api to update the tutorial step
                    EventBus.emit(EventName.RequestUpdateTutorial)
                })
                this.scene.events.emit(EventName.TutorialOpenShop)
                // thus, show an animated arrow pointing to the shop button
                // get position of the shop button
                this.hide()
                return
            }
            case TutorialStep.StartOpenInventory: {
                // when user press the shop button
                this.scene.events.once(
                    EventName.TutorialOpenInventoryResponsed,
                    ({ position }: TutorialOpenInventoryResponsedMessage) => {
                        this.displayPressHereArrow({
                            rotation: 45,
                            originPosition: { x: position.x - 60, y: position.y + 60 },
                            targetPosition: { x: position.x - 40, y: position.y + 40 },
                        })
                    }
                )
                // emit the event to open the inventory
                this.scene.events.emit(EventName.TutorialOpenInventory)
                // hide the stacy
                this.hide()
                return
            }
            case TutorialStep.StartPlantSeeds: {
                //check how many seeds planteds
                let count = 2
                const placedItems = getPlacedItemsWithSeedGrowthInfo({ scene: this.scene })
                if (placedItems.length === 1) {
                    count = 1
                }
                if (placedItems.length >= 2) {
                    EventBus.emit(EventName.RequestUpdateTutorial)
                    return
                }

                const generatePlantSeedText = (count: number) => {
                    return `Now, tap on the tile to plant the seeds. ${count} left.`
                }
                EventBus.once(EventName.TutorialTilePressedResponsed, ({ position }: TutorialOpenInventoryResponsedMessage) => {
                    this.displayPressHereArrow({
                        originPosition: { x: position.x + 80, y: position.y + 80 },
                        targetPosition: { x: position.x + 60, y: position.y + 60 },
                    })
                })
                this.scene.events.once(EventName.TutorialSeedsSelected, () => {
                    EventBus.emit(EventName.HideUIBackdrop)
                    EventBus.emit(EventName.HideButtons)
                    this.showHelpDialog(generatePlantSeedText(count))
                })
                
                EventBus.on(EventName.TutorialSeedPlanted, () => {
                    count--
                    if (count === 0) {
                        EventBus.off(EventName.TutorialSeedPlanted)
                        EventBus.emit(EventName.RequestUpdateTutorial)
                        return
                    }
                    this.showHelpDialog(generatePlantSeedText(count))
                })
                // hide the stacy
                this.hide()
                // close the backdrop
                //EventBus.emit(EventName.HideUIBackdrop)
                //EventBus.emit(EventName.HideButtons)
                //this.showHelpDialog(generatePlantSeedText(2))
                // emit the event to open the inventory
                this.scene.events.emit(EventName.TutorialPlantSeeds)
                this.showHelpDialog("Select seed from toolbar.")
                return
            }
            case TutorialStep.StartWaterCropAtStage1: {
                let count = 2
                
                const generateWaterText = (count: number) => {
                    return `Now, tap on the tile to water the seeds. ${count} left.`
                }
                this.scene.events.once(EventName.TutorialWaterCanPressed, () => {
                    EventBus.emit(EventName.HideUIBackdrop)
                    EventBus.emit(EventName.HideButtons)
                    this.showHelpDialog(generateWaterText(count))
                })
                // hide the stacy
                this.hide()
                this.scene.events.emit(EventName.TutorialPlantSeeds)
                this.showHelpDialog("Select water can from toolbar.")
                return
            }
            default: {
                break
            }
            }
            // check if whether this step is the last of the phase, we turn off the tutorial
            if (tutorialStepMap[this.user.tutorialStep].lastOfThisPhase) {
                this.scene.events.emit(EventName.CloseTutorial)
                return
            }
            // we call the api to update the tutorial step
            EventBus.emit(EventName.RequestUpdateTutorial)
        })
    }

    //show the stacy
    public show() {
        this.setVisible(true).setActive(true)
    }

    // hide the stacy
    public hide() {
        this.setVisible(false).setActive(false)
    }

    // check if the stacy is shown
    public isShown() {
        return this.visible && this.active
    }

    private displayPressHereArrow({
        originPosition,
        targetPosition,
        rotation = -45,
        requireSetVisibility = true,
    }: DisplayPressHereArrowParams) {
        if (requireSetVisibility) {
            this.pressHereArrow?.setVisible(true)
        }
        // remove the previous tween
        if (!this.pressHereArrow) {
            throw new Error("Press here arrow not found")
        }
        this.pressHereArrow
            .setPosition(originPosition.x, originPosition.y)
            .setRotation(rotation)
        this.scene.tweens.killTweensOf(this.pressHereArrow)
        this.scene.tweens.add({
            targets: this.pressHereArrow,
            y: targetPosition.y,
            x: targetPosition.x,
            duration: 1000,
            yoyo: true,
            repeat: -1,
        })
    }

    // disallow the player to press to continue
    private disallowPressToContinue(hidePressToContinueIfAllowed = false) {
        if (hidePressToContinueIfAllowed) {
            return
        }
    }

    // render the stacy image
    public render() {
        // show the stacy
        if (!this.isShown()) {
            this.show()
        }
        // if press to continue is true, turn it off
        this.disallowPressToContinue(true)
        // set continue to false
        const textureAssetKey = tutorialStepMap[this.user.tutorialStep].assetKey
        this.stacyImage.setTexture(textureAssetKey)
        this.playSetTextAnimation(tutorialStepMap[this.user.tutorialStep].message)
    }

    private async playSetTextAnimation(fullText: string) {
    // we cut the text into characters
        const characters = fullText.split("")
        // we create an empty string
        let text = ""
        // we iterate over the characters
        for (let i = 0; i < characters.length; i++) {
            // we add the character to the text
            text += characters[i]
            // we set the text of the stacy bubble
            this.stacyBubble?.setText(text).layout()
            // we wait 20ms before adding the next character
            await sleep(20)
        }
        // we allow the player to press to continue
        this.allowPressToContinue()
    }
}

export interface DisplayPressHereArrowParams {
  // set visibility
  requireSetVisibility?: boolean;
  // the position of the arrow
  targetPosition: Position;
  // the origin position of the arrow
  originPosition: Position;
  // rotation of the arrow
  rotation?: number;
}
