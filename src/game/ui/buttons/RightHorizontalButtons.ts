import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { BaseAssetKey } from "../../assets"
import { EventName, TutorialOpenShopResponsedMessage } from "../../event-bus"
import { HorizontalButtons } from "./HorizontalButtons"
import { ButtonsBaseConstructorParams } from "@/game/types"
import { ModalName } from "../modals"
import { calculateUiDepth, UILayer } from "../../layers"

export class RightHorizontalButtons extends HorizontalButtons {
    private settingButton: Sizer
    private inventoryButton: Sizer
    private dailyButton: Sizer
    private questButton: Sizer

    constructor(baseParams: ButtonsBaseConstructorParams) {
        super({
            baseParams,
            options: {
                orientation: "y",
                space: 36,
            }
        })

        // add setting button
        this.settingButton = this.createButton({
            iconKey: BaseAssetKey.IconSetting,
            text: "Settings",
            onClick: () => {
                console.log("Setting")
            },
        })
        this.addButton(this.settingButton)

        // add inventory button
        this.inventoryButton = this.createButton({
            iconKey: BaseAssetKey.IconInventory,
            text: "Inventory",
            onClick: () => {
                this.scene.events.emit(EventName.OpenModal, ModalName.Inventory)
            },
        })
        this.addButton(this.inventoryButton)

        // add daily button
        this.dailyButton = this.createButton({
            iconKey: BaseAssetKey.IconDaily,
            text: "Daily",
            onClick: () => {
                this.scene.events.emit(EventName.OpenModal, ModalName.Daily)
            },
        })
        this.addButton(this.dailyButton)

        // add quest button
        this.questButton = this.createButton({
            iconKey: BaseAssetKey.IconQuest,
            text: "Quest",
            onClick: () => {
                this.scene.events.emit(EventName.OpenModal, ModalName.Quest)
            },
        })
        this.addButton(this.questButton)

        // listen for the open event
        this.scene.events.once(EventName.TutorialOpenInventory, () => {
            this.inventoryButton.setDepth(calculateUiDepth({
                layer: UILayer.Tutorial,
                layerDepth: 2,
            }))
            const eventMessage: TutorialOpenShopResponsedMessage = {
                position: this.inventoryButton.getCenter()
            }
            this.scene.events.emit(EventName.TutorialOpenInventoryResponsed, eventMessage)
            // if shop button is press, we will console go
            this.inventoryButton.once("pointerdown", () => {
                // return to normal depth
                this.inventoryButton.setDepth(calculateUiDepth({
                    layer: UILayer.Base,
                }))
                // emit the event
                this.scene.events.emit(EventName.TutorialInventoryButtonPressed)
                // hide the press here arrow
                this.scene.events.emit(EventName.HidePressHereArrow)
            })
        })
    }
}
