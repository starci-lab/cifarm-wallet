import { SceneEventEmitter, SceneEventName, ShowBackdropMessage, UpdateBackdropMessage } from "../../events"
import { BLACK_COLOR } from "../../constants"
import { ContainerLiteBaseConstructorParams } from "../../types"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { getScreenCenterX, getScreenCenterY } from "../utils"

const OPACITY_LEVEL = 0.75
export class UIBackdrop extends ContainerLite {
    private backdrop: Phaser.GameObjects.Rectangle

    constructor({ scene, x, y, width, height, children }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)

        //full size backdrop
        const { width: gameWidth, height: gameHeight } = scene.game.scale
        this.backdrop = this.scene.add
            .rectangle(
                getScreenCenterX(this.scene),
                getScreenCenterY(this.scene),
                gameWidth,
                gameHeight,
                BLACK_COLOR
            )
            .setInteractive()
        this.add(this.backdrop)

        SceneEventEmitter.on(SceneEventName.ShowBackdrop, ({ depth, transparency }: ShowBackdropMessage) => {
            this.show()
            console.log("show backdrop")
            this.backdrop.setDepth(depth).setAlpha(!transparency ? OPACITY_LEVEL : 0.01)
        })
        
        SceneEventEmitter.on(SceneEventName.HideBackdrop, () => {
            // short delay to prevent flickering
            this.scene.time.delayedCall(10, () => {
                this.hide()
            })
        })

        SceneEventEmitter.on(SceneEventName.UpdateBackdrop, ({ depth }: UpdateBackdropMessage) => {
            this.backdrop.setDepth(depth)
        })

        // hide by default
        this.hide()
    }

    private hide() {
        this.backdrop.setVisible(false)
    }

    private show() {
        this.backdrop.setVisible(true)
    }
}