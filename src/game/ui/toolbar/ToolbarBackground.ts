import { BaseAssetKey } from "../../assets"
import { ContainerBaseConstructorParams } from "../../types"
import { Label } from "phaser3-rex-plugins/templates/ui/ui-components"
import { onGameObjectClick } from "../utils"

export class ToolbarBackground extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Image
    private prevButton: Label
    private nextButton: Label
    
    constructor({ scene, x, y }: ContainerBaseConstructorParams) {
        super(scene, x, y)
        // create the background
        this.background = this.scene.add.image(
            0,
            0,
            BaseAssetKey.ToolbarBackground
        ).setOrigin(0.5, 1)
        this.add(this.background)
    
        // create the prev button
        this.prevButton = this.createPrevButton()
        this.add(this.prevButton)
        // create the next button
        this.nextButton = this.createNextButton()
        this.add(this.nextButton)  
    }
    
    private createPrevButton() {
        const background = this.scene.add.image(
            0,
            0,
            BaseAssetKey.ToolbarPrevAvatar
        )
        const icon = this.scene.add.image(0, 0, BaseAssetKey.ToolbarPrevIcon)
        //
        const prevButton = this.scene.rexUI.add
            .label({
                x: -(this.background.width / 2 - 110),
                y: -(this.background.height/ 2 + 20),
                width: background.width,
                height: background.height,
                background,
                icon,
                align: "center",
            })
            .layout()
        prevButton.setInteractive().on("pointerdown", () => {
            onGameObjectClick({
                gameObject: prevButton,
                onClick: () => {
                    console.log("prev button clicked")
                },
                scene: this.scene,
            })
        })
        return prevButton
    }
    
    private createNextButton() {
        const background = this.scene.add.image(
            0,
            0,
            BaseAssetKey.ToolbarNextAvatar
        )
        const icon = this.scene.add.image(0, 0, BaseAssetKey.ToolbarNextIcon)
        //
        const nextButton = this.scene.rexUI.add
            .label({
                originX: 1,
                x: this.background.width / 2 - 80,
                y: -(this.background.height/ 2 + 20),
                width: background.width,
                height: background.height,
                background,
                icon,
                align: "center",
            })
            .layout()
        nextButton.setInteractive().on("pointerdown", () => {
            onGameObjectClick({
                gameObject: nextButton,
                onClick: () => {
                    console.log("next button clicked")
                },
                scene: this.scene,
            })
        })
        return nextButton
    }
}