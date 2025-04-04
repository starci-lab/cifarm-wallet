import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer"
import {
    CacheKey,
    BaseSizerBaseConstructorParams,
    DeliveryData,
} from "../../../../types"
import { InventorySchema, InventoryTypeSchema } from "@/modules/entities"
import {
    BaseAssetKey,
    inventoryTypeAssetMap,
    baseAssetMap,
} from "../../../../assets"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { Background, ModalBackground, NumberInput } from "../../../elements"
import {
    DeliverAdditionalInventoryMessage,
    DeliverInventoryMessage,
} from "@/hooks"
import {
    SceneEventEmitter,
    SceneEventName,
    ModalName,
    ExternalEventEmitter,
    CloseModalMessage,
    ExternalEventName,
} from "../../../../events"

export class InputQuantityContent extends BaseSizer {
    private background: ModalBackground
    private inventoryTypes: Array<InventoryTypeSchema> = []
    private productLabel: Label
    private quantity = 1
    private numberInput: NumberInput
    private mainContainer: Sizer
    private iconContainer: ContainerLite
    private inventory: InventorySchema | undefined

    constructor({
        scene,
        x,
        y,
        height,
        width,
        config,
    }: BaseSizerBaseConstructorParams) {
        super(scene, x, y, height, width, config)

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
                title: "Quantity",
                onXButtonPress: () => {
                    SceneEventEmitter.emit(SceneEventName.CloseModal, {
                        modalName: ModalName.InputQuantity,
                    })
                },
                mainButton: {
                    onPress: () => {
                        if (!this.inventory) {
                            throw new Error("Inventory is not set")
                        }
                        const { index, isMore } = this.scene.cache.obj.get(
                            CacheKey.DeliveryData
                        ) as DeliveryData
                        if (!isMore) {
                            const deliverInventoryEventMessage: DeliverInventoryMessage = {
                                quantity: this.quantity,
                                inventoryId: this.inventory.id,
                                index,
                            }
                            ExternalEventEmitter.emit(
                                ExternalEventName.RequestDeliverInventory,
                                deliverInventoryEventMessage
                            )
                            const closeModalEventMessage: CloseModalMessage = {
                                modalName: ModalName.InputQuantity,
                            }
                            SceneEventEmitter.emit(
                                SceneEventName.CloseModal,
                                closeModalEventMessage
                            )
                        } else {
                            const eventMessage: DeliverAdditionalInventoryMessage = {
                                quantity: this.quantity,
                                inventoryId: this.inventory.id,
                                index,
                            }
                            ExternalEventEmitter.emit(
                                ExternalEventName.RequestDeliverAdditionalInventory,
                                eventMessage
                            )
                            const closeModalEventMessage: CloseModalMessage = {
                                modalName: ModalName.InputQuantity,
                            }
                            SceneEventEmitter.emit(
                                SceneEventName.CloseModal,
                                closeModalEventMessage
                            )
                        }
                    },
                    text: "Confirm",
                },
            },
        })
        this.scene.add.existing(this.background)
        this.addLocal(this.background)

        this.mainContainer = this.scene.rexUI.add.sizer({
            orientation: "y",
            space: { item: 40 },
            originY: 1,
        })
        const frame = this.scene.add.image(
            0,
            0,
            baseAssetMap[BaseAssetKey.UIModalCommonFrame].base.textureConfig.key
        )
        this.iconContainer = this.scene.rexUI.add.container(0, 0)
        this.productLabel = this.scene.rexUI.add
            .label({
                background: frame,
                width: frame.width,
                height: frame.height,
                align: "center",
                icon: this.iconContainer,
            })
            .layout()
        this.mainContainer.add(this.productLabel)
        //const input = new Input(userNameField)
        this.numberInput = new NumberInput({
            baseParams: {
                scene: this.scene,
            },
            options: {
                onChange: (value) => {
                    this.quantity = value
                },
                defaultValue: 1,
                showLeftArrow: true,
                showRightArrow: true,
            },
        }).layout()
        this.scene.add.existing(this.numberInput)
        this.mainContainer.add(this.numberInput)
        if (!this.background.mainButton) {
            throw new Error("Main button not found")
        }
        this.mainContainer
            .layout()
            .setPosition(
                this.background.mainButton.x,
                this.background.mainButton.y -
          (this.background.mainButton.height / 2 + 40)
            )
        if (!this.background.container) {
            throw new Error("Container not found")
        }
        this.background.container.add(this.mainContainer)
        this.inventoryTypes = this.scene.cache.obj.get(CacheKey.InventoryTypes)
        SceneEventEmitter.on(
            SceneEventName.UpdateInputQuantityModal,
            () => {
                const inventory = this.scene.cache.obj.get(
                    CacheKey.InputQuantityModalData
                ) as InventorySchema
                this.render(inventory)
            }
        )
    }

    public render(inventory: InventorySchema) {
    // set the inventory
        this.inventory = inventory

        const inventoryType = this.inventoryTypes.find(
            (type) => type.id === inventory.inventoryType
        )
        if (!inventoryType) {
            throw new Error("Inventory type not found")
        }
        const {
            base: { textureConfig: { key } },
        } = inventoryTypeAssetMap[inventoryType.displayId]

        const image = this.scene.add.image(0, 0, key).setDepth(this.depth + 1)

        this.numberInput.setBounds({
            min: 1,
            max: inventory.quantity,
        })
        // reset the quantity of the number input
        this.numberInput.setValue(this.numberInput.min)
        this.quantity = this.numberInput.min
        this.iconContainer.clear(true)
        this.iconContainer.addLocal(image)
    }
}
