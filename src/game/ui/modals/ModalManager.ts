import { EventName } from "@/game/event-bus"
import { BLACK_COLOR, SCALE_TIME } from "../../constants"
import { ShopModal } from "./shop"
import { ContainerBaseConstructorParams } from "../../types"
import { InventoryModal } from "./inventory"
import { DailyModal } from "./daily"
import { QuestModal } from "./quest"
import { StandModal } from "./stand"

export enum ModalName {
    Shop = "shop",
    Inventory = "inventory",
    Daily = "daily",
    Quest = "quest",
    Stand = "stand",
}

export class ModalManager extends Phaser.GameObjects.Container {
    private backdrop: Phaser.GameObjects.Rectangle | undefined

    // the shop modal
    private shopModal: ShopModal | undefined
    // inventory modal
    private inventoryModal: InventoryModal | undefined
    // daily modal
    private dailyModal: DailyModal | undefined
    // quest modal
    private questModal: QuestModal | undefined
    //stand modal
    private standModal: StandModal | undefined

    constructor({ scene, x, y }: ContainerBaseConstructorParams) {
        super(scene, x, y)

        // get the width and height of the game
        const { width, height } = this.scene.game.scale
        this.backdrop = scene.add
            .rectangle(0, 0, width, height, BLACK_COLOR, 0.5)
            .setInteractive()
        this.add(this.backdrop)

        // create the shop modal
        this.shopModal = new ShopModal({
            scene: this.scene,
            x: this.x,
            y: this.y,
        }).hide()

        // create the inventory modal
        this.inventoryModal = new InventoryModal({
            scene: this.scene,
        }).hide()

        // create the daily modal
        this.dailyModal = new DailyModal({
            scene: this.scene,
        }).hide()


        // create the quest modal
        this.questModal = new QuestModal({
            scene: this.scene,
        }).hide()

        // create the stand modal
        this.standModal = new StandModal({
            scene: this.scene,
        }).hide()
        
        // listen for the open event
        this.scene.events.on(EventName.OpenModal, (name: ModalName) => {
            this.onOpen(name)
        })

        // listen for the close event
        this.scene.events.on(EventName.CloseModal, (name: ModalName) => {
            this.onClose(name)
        })

        // close the modal manager by default
        this.setActive(false).setVisible(false)
    }

    private getModal(name: ModalName) {
        switch (name) {
        case ModalName.Shop: {
            if (!this.shopModal) {
                throw new Error("Shop modal not found")
            }
            return this.shopModal
        }
        case ModalName.Inventory: {
            if (!this.inventoryModal) {
                throw new Error("Shop modal not found")
            }
            return this.inventoryModal
        }
        case ModalName.Daily: {
            if (!this.dailyModal) {
                throw new Error("Daily modal not found")
            }
            return this.dailyModal
        }
        case ModalName.Quest: {
            if (!this.questModal) {
                throw new Error("Quest modal not found")
            }
            return this.questModal
        }
        case ModalName.Stand: {
            if (!this.standModal) {
                throw new Error("Stand modal not found")
            }
            return this.standModal
        }
        }
    }

    private onOpen(name: ModalName) {
        this.setActive(true).setVisible(true)
        const modal = this.getModal(name)
        // disable modal input
        if (modal.input) {
            modal.input.enabled = false
        }
        // show the modal
        modal.show().setDepth(1).popUp(SCALE_TIME)

        // Wait for the animation to finish, then re-enable interaction
        this.scene.time.delayedCall(SCALE_TIME, () => {
            if (this.input) {
                this.input.enabled = true
            }
        })
    }

    private onClose(name: ModalName) {
        const modal = this.getModal(name)
        // hide the modal
        modal.hide()
        this.setActive(false).setVisible(false)
    }
}
