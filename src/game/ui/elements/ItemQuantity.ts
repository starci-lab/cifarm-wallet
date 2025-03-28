import {
    ConstructorParams,
    BadgeLabelBaseConstructorParams,
} from "@/game/types"
import { BadgeLabel } from "phaser3-rex-plugins/templates/ui/ui-components"
import { Text } from "./Text"

export interface ItemQuantityOptions {
  assetKey: string;
  //quantity of the item
  quantity?: number;
  // show the badge
  showBadge?: boolean;
  // scale the icon
  scale?: number;
  // width of the item
  itemWidth?: number;
  // height of the item
  itemHeight?: number;
}

export class ItemQuantity extends BadgeLabel {
    private constructorParams: ConstructorParams<
    BadgeLabelBaseConstructorParams,
    ItemQuantityOptions
  >
    constructor(
        constructorParams: ConstructorParams<
      BadgeLabelBaseConstructorParams,
      ItemQuantityOptions
    >
    ) {
        const {
            baseParams: { scene, config },
            options,
        } = constructorParams
        if (!options) {
            throw new Error("ItemQuantity requires options")
        }
        const {
            assetKey,
            quantity = 1,
            showBadge = false,
            scale = 1,
            itemWidth,
            itemHeight,
        } = options
        // create the icon
        const iconContainer = scene.rexUI.add.container(0, 0)
        const iconImage = scene.add.image(0, 0, assetKey)
        const width = iconImage.width * scale
        const height = iconImage.height * scale
        const icon = scene.rexUI.add
            .label({
                background: iconImage,
                width,
                height,
            })
            .layout()
        iconContainer.addLocal(icon)
        let rightBottomText: Text | undefined
        if (showBadge) {
            rightBottomText = new Text({
                baseParams: {
                    scene,
                    text: quantity ? quantity.toString() : "0",
                    x: 0,
                    y: 0,
                    style: {
                        padding: {
                            right: 10,
                            bottom: 10,
                        },
                    },
                },
                options: {
                    enableStroke: true,
                },
            })
            scene.add.existing(rightBottomText)
        }

        const thisWidth = itemWidth || width
        const thisHeight = itemHeight || height
        super(scene, {
            center: iconContainer,
            width: thisWidth,
            height: thisHeight,
            rightBottom: rightBottomText,
            ...config,
        })

        this.constructorParams = constructorParams
    }

    public duplicate() {
        const position = this.getCenter()
        const duplicated = new ItemQuantity(this.constructorParams).setPosition(
            position.x,
            position.y
        )
        this.scene.add.existing(duplicated)
        duplicated.layout()
        return duplicated
    }
}
