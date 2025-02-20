import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { Label } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseAssetKey } from "../../../assets"
import { CloseModalMessage, EventBus, EventName, ModalName } from "../../../event-bus"
import { ContainerLiteBaseConstructorParams } from "../../../types"
import { BaseText, StrokeColor } from "../../elements"
import { onGameObjectPress } from "../../utils"

export class DailyBackground extends ContainerLite {
    private wall: Phaser.GameObjects.Image
    private dailyTitle: Label
    private closeButton: Phaser.GameObjects.Image | undefined

    constructor({ scene, x, y, width, height, children }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)
        
        // create the wall
        this.wall = this.scene.add.image(0, 0, BaseAssetKey.UIModalDailyWall)
        this.addLocal(this.wall)

        // create the daily title
        const dailyTitle = this.scene.add.image(0, 0, BaseAssetKey.UIModalDailyTitle)
        const text = new BaseText({
            baseParams: { 
                scene: this.scene,
                x: 0,
                y: 0,
                text: "Daily Reward",
            },
            options: {
                enableStroke: true,
                fontSize: 48,
                strokeColor: StrokeColor.RoyalPurple,
                strokeThickness: 6,
            }      
        })
        this.scene.add.existing(text)
        this.dailyTitle = this.scene.rexUI.add.label({
            width: dailyTitle.width,
            height: dailyTitle.height,
            background: dailyTitle,
            text,
            align: "center",  
        }).setInnerPadding({
            bottom: 40,
        }).layout().setPosition(0, -360)
        this.addLocal(this.dailyTitle)

        // create the close button
        this.closeButton = this.createCloseButton()
    }

    // create the close button
    public createCloseButton() {
        // create the close button
        const closeButton = this.scene.add.sprite(0, 0, BaseAssetKey.UIModalDailyIconClose).setOrigin(1, 0)
        this.scene.add.existing(closeButton)
        
        // add the on click event
        closeButton.setInteractive().on("pointerdown", () => {
            onGameObjectPress({
                gameObject: closeButton,
                onPress: () => {
                    const eventMessage: CloseModalMessage = {
                        modalName: ModalName.Daily,
                    }
                    EventBus.emit(EventName.CloseModal, eventMessage)
                },
                scene: this.scene,
            })
        })
            
        // set the position of the close button
        closeButton.setPosition(this.wall.width / 2 - 100, - this.wall.height / 2 + 50)
        // add the close button to the sizer
        this.addLocal(closeButton)
        return closeButton
    }
}