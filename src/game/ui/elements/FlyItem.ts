import { ConstructorParams, SizerBaseConstructorParams } from "@/game/types"
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { Text } from "./Text"

export interface FlyItemOptions {
  scale?: number;
  iconAssetKey?: string;
  quantity?: number;
  text?: string;
  duration?: number;
  depth?: number;
  x: number;
  y: number;
  flyHeight?: number;
  showIcon?: boolean;
  badgeIconAssetKey?: string;
}

export class FlyItem extends Sizer {
    constructor({
        baseParams: { scene, config },
        options,
    }: ConstructorParams<SizerBaseConstructorParams, FlyItemOptions>) {
        if (!options) {
            throw new Error("FlyItem requires options")
        }
        super(scene, {
            originY: 1,
            ...config,
        })
        const {
            iconAssetKey,
            quantity = 0,
            scale = 1,
            duration = 2000,
            depth = 1,
            x,
            y,
            text = "",
            flyHeight = 200,
            showIcon = true,
            badgeIconAssetKey 
        } = options

        const flyItemText = new Text({
            baseParams: {
                scene,
                text: `${text.length > 0 ? `${text} ` : ""}${
                    quantity != 0 ? `${quantity > 0 ? "+" + quantity : quantity}` : ""
                }`,
                x: 0,
                y: 0,
            },
            options: {
                enableStroke: true,
                fontSize: +`${text.length > 0 ? 32 : 48}`,
            },
        })
        scene.add.existing(flyItemText)
        this.add(flyItemText, {
            align: "center",
        })
        if (showIcon) {
            if (!iconAssetKey) {
                throw new Error("FlyItem requires iconAssetKey")
            }
            const background = scene.add.image(0, 0, iconAssetKey)
            // badge icon
            let badgeIcon: Phaser.GameObjects.Image | undefined
            if (badgeIconAssetKey) {
                badgeIcon = scene.add.image(0, 0, badgeIconAssetKey)
            }
            const badge = scene.rexUI.add.badgeLabel({
                background,
                width: background.width,
                height: background.height,
                leftTop: badgeIcon,
            }).layout()
            this.add(badge, {
                align: "center",
            })
        }
        this.layout()
        this.setDepth(depth).setPosition(x, y)
        this.setScale(scale)
        this.scene.tweens.add({
            targets: this,
            y: this.y - flyHeight,
            alpha: 0,
            duration: duration,
            onComplete: () => {
                this.destroy()
            },
        })
    }
}
