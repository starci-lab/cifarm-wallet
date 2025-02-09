import { ShopContent } from "./ShopContent"
import { ShopBackground } from "./ShopBackground"
import { ShopHeader } from "./ShopHeader"
import { ShopTabs } from "./ShopTabs"
import { SizerBaseConstructorParams } from "@/game/types"
import {
    getScreenBottomY,
    getScreenCenterX,
    getScreenCenterY,
    getScreenLeftX,
} from "../../utils"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { calculateUiDepth, UILayer } from "../../../layers"
import { IModal } from "@/game/interfaces"
import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer"

export const CONTENT_DEPTH = calculateUiDepth({
    layer: UILayer.Modal,
    additionalDepth: 10,
    layerDepth: 1,
})

export const HIGHLIGH_DEPTH = calculateUiDepth({
    layer: UILayer.Tutorial,
    layerDepth: 1,
})

// shop modal extends BaseSizer
export class ShopModal extends BaseSizer implements IModal {
    private shopContent: ShopContent
    private shopHeader: ShopHeader
    private shopTabs: ShopTabs
    private shopBackground: ContainerLite

    constructor({
        scene,
        x,
        y,
        height,
        width,
        config,
    }: SizerBaseConstructorParams) {
        super(scene, x, y, height, width, config)

        this.shopBackground = new ShopBackground({
            scene: this.scene,
            x: getScreenCenterX(this.scene),
            y: getScreenBottomY(this.scene),
        })
        this.scene.add.existing(this.shopBackground)
        this.add(this.shopBackground)

        //create the shop content
        this.shopContent = new ShopContent({
            scene: this.scene,
        }).setDepth(CONTENT_DEPTH)

        this.scene.add.existing(this.shopContent)
        this.add(this.shopContent)

        // create the shop tabs
        this.shopTabs = new ShopTabs({
            scene: this.scene,
            x: getScreenLeftX(this.scene),
            y: getScreenCenterY(this.scene) - 600,
        })
        this.scene.add.existing(this.shopTabs)
        this.add(this.shopTabs)

        // create the shop header
        this.shopHeader = new ShopHeader({
            scene: this.scene,
            x: getScreenCenterX(this.scene),
            y: getScreenCenterY(this.scene) - 500,
        })
        
        this.scene.add.existing(this.shopHeader)
        this.add(this.shopHeader)

        this.setDirty(false)
    }
}
