import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseAssetKey, baseAssetMap } from "../../assets"
import { SceneEventEmitter, SceneEventName, ModalName, OpenModalMessage } from "../../events"
import { ButtonsBaseConstructorParams, CacheKey } from "../../types"
import { HorizontalButtons } from "./HorizontalButtons"

export class LeftHorizontalButtons extends HorizontalButtons {
    private nftMarketplaceButton : Sizer
    private shopButton : Sizer
    private roadsideStandButton : Sizer
    private neighborsButton : Sizer
    
    constructor(baseParams: ButtonsBaseConstructorParams) {
        super({
            baseParams: {
                scene: baseParams.scene,
                config: {
                    ...baseParams.config,
                    originX: 0,
                    originY: 0,
                }
            },
            options: {
                orientation: "y",
                space: 36,
            }
        })

        // add nft button
        this.nftMarketplaceButton = this.createButton({
            iconKey: baseAssetMap[BaseAssetKey.UIIconNFTMarketplace].base.textureConfig.key,
            text: "NFT Marketplace",
            onPress: () => {
                console.log("NFT")
            },
        })
        this.addButton(this.nftMarketplaceButton)

        // add shop button
        this.shopButton = this.createButton({
            iconKey: baseAssetMap[BaseAssetKey.UIIconShop].base.textureConfig.key,
            text: "Shop",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Shop
                }
                SceneEventEmitter.emit(SceneEventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.shopButton)
        // add roadside stand button
        this.roadsideStandButton = this.createButton({
            iconKey: baseAssetMap[BaseAssetKey.UIIconRoadsideStand].base.textureConfig.key,
            text: "Roadside Stand",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Stand
                }
                SceneEventEmitter.emit(SceneEventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.roadsideStandButton)

        // add neighbors button
        this.neighborsButton = this.createButton({
            iconKey: baseAssetMap[BaseAssetKey.UIIconNeighbors].base.textureConfig.key,
            text: "Neighbors",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Neighbors
                }
                SceneEventEmitter.emit(SceneEventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.neighborsButton)

        SceneEventEmitter.on(SceneEventName.HideButtons, () => {
            this.setVisible(false).setActive(false)
        })
        
        SceneEventEmitter.on(SceneEventName.ShowButtons, () => {
            this.setVisible(true).setActive(true)
        })

        if (this.scene.cache.obj.get(CacheKey.WatchingUser)) {
            this.setVisible(false).setActive(false)
        }
    }
}
