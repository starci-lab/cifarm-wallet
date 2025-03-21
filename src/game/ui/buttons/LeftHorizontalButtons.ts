import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseAssetKey } from "../../assets"
import { EventBus, EventName, ModalName, OpenModalMessage } from "../../event-bus"
import { ButtonsBaseConstructorParams, CacheKey } from "../../types"
import { HorizontalButtons } from "./HorizontalButtons"

export class LeftHorizontalButtons extends HorizontalButtons {
    private nftMarketplaceButton : Sizer
    private shopButton : Sizer
    private roadsideStandButton : Sizer
    private neighborsButton : Sizer
    private spinButton: Sizer
    
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
            iconKey: BaseAssetKey.UIIconNFTMarketplace,
            text: "NFT Marketplace",
            onPress: () => {
                console.log("NFT")
            },
        })
        this.addButton(this.nftMarketplaceButton)

        // add shop button
        this.shopButton = this.createButton({
            iconKey: BaseAssetKey.UIIconShop,
            text: "Shop",
            onPress: () => {
                EventBus.emit(EventName.RefreshPlaceItemsCacheKey)
                
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Shop
                }
                EventBus.emit(EventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.shopButton)

        // add spin button
        this.spinButton = this.createButton({
            iconKey: BaseAssetKey.UIIconSpin,
            text: "Spin",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Spin
                }
                EventBus.emit(EventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.spinButton)

        // add roadside stand button
        this.roadsideStandButton = this.createButton({
            iconKey: BaseAssetKey.UIIconRoadsideStand,
            text: "Roadside Stand",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Stand
                }
                EventBus.emit(EventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.roadsideStandButton)

        // add neighbors button
        this.neighborsButton = this.createButton({
            iconKey: BaseAssetKey.UIIconNeighbors,
            text: "Neighbors",
            onPress: () => {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.Neighbors
                }
                EventBus.emit(EventName.OpenModal, eventMessage)
            },
        })
        this.addButton(this.neighborsButton)

        EventBus.on(EventName.HideButtons, () => {
            this.setVisible(false).setActive(false)
        })
        
        EventBus.on(EventName.ShowButtons, () => {
            this.setVisible(true).setActive(true)
        })

        if (this.scene.cache.obj.get(CacheKey.WatchingUser)) {
            this.setVisible(false).setActive(false)
        }
    }
}
