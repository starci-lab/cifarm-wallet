import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer"
import { BaseSizerBaseConstructorParams } from "../../../types"
import { Background, BBCodeText, getBackgroundContainerSize, ModalBackground, Size, SizeStyle, TextColor } from "../../elements"
import { EventBus, EventName, ModalName, UpdateWarningModalMessage } from "@/game/event-bus"
import { MODAL_DEPTH_2 } from "../ModalManager"

export class WarningContent extends BaseSizer {
    private background: ModalBackground
    private bbCodeText: BBCodeText | undefined
    private size: Size
    private callback: (() => void) | undefined
    constructor({
        scene,
        height,
        width,
        x,
        y,
        config,
    }: BaseSizerBaseConstructorParams) {
        super(
            scene,
            x,
            y,
            width,
            height,
            config
        )

        this.background = new ModalBackground({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 0,
                width,
                height,
            },
            options: {
                container: {
                    showContainer: true,
                    showWrapperContainer: false,
                },
                align: "center",
                background: Background.Small,
                title: "Warning",
                onXButtonPress: () => {
                    EventBus.emit(EventName.CloseModal, {
                        modalName: ModalName.Warning,
                    })
                },
                mainButton: {
                    text: "OK",
                    onPress:() => {   
                        EventBus.emit(EventName.CloseModal, {
                            modalName: ModalName.Warning,
                        })
                        if (this.callback) {
                            this.callback()
                        }
                    }
                }
            }
        })
        this.scene.add.existing(this.background)
        this.addLocal(this.background)

        this.size = getBackgroundContainerSize({
            style: SizeStyle.Container,
            background: Background.Small,
        })

        this.scene.events.on(EventName.UpdateWarningModal, ({ message, callback }: UpdateWarningModalMessage) => {
            if (!this.size.width) {
                throw new Error("Size width not found")
            }
            this.bbCodeText = new BBCodeText({
                baseParams: { scene: this.scene, text: message, x: 0, y: 40 },
                options: {
                    textColor: TextColor.Brown,
                    fontSize: 32,
                    enableWordWrap: true,
                    width: this.size.width - 80,
                }
            }).setOrigin(0.5, 0).setDepth(MODAL_DEPTH_2 + 1)
            this.scene.add.existing(this.bbCodeText)
            if (!this.background.container) {
                throw new Error("Background container not found")
            }
            this.background.container.addLocal(this.bbCodeText)
            if (callback) {
                this.callback = callback
            }
        })

        this.layout()
    }
}