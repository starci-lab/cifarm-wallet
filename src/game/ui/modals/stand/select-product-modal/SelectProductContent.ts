import BaseSizer from "phaser3-rex-plugins/templates/ui/basesizer/BaseSizer"
import {
    CacheKey,
    BaseSizerBaseConstructorParams,
    DeliveryData,
} from "../../../../types"
import {
    GridTable,
    ItemQuantity,
    GridTableFrame,
    ModalBackground,
    Background,
    XButton,
    CellSize,
    getCellSize,
} from "../../../elements"
import {
    InventoryKind,
    InventorySchema,
    InventoryTypeSchema,
} from "@/modules/entities"
import {
    getDeliveryInventories,
    getProductInventories,
} from "../../../../queries"
import { EventBus, EventName, ModalName } from "../../../../event-bus"
import { onGameObjectPress } from "@/game/ui/utils"
import { MODAL_DEPTH_2 } from "../../ModalManager"
import { IPaginatedResponse } from "@/modules/apollo"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { inventoryTypeAssetMap } from "@/game/assets"
import { CELL_SELECT_PRODUCT_DATA_KEY } from "./constants"
import { restoreTutorialDepth, setTutorialDepth } from "@/game/ui/tutorial"

export class SelectProductContent extends BaseSizer {
    private background: ModalBackground
    private inventoryTypes: Array<InventoryTypeSchema> = []
    private gridTable: GridTable<InventorySchema> | undefined
    private gridMap: Record<number, ItemQuantity> = {}
    private inventories: Array<InventorySchema> = []
    private cellSize: CellSize

    constructor({ scene, x, y, width, height }: BaseSizerBaseConstructorParams) {
        super(scene, x, y, width, height)
        this.cellSize = getCellSize(this.scene)

        const { data } = this.scene.cache.obj.get(
            CacheKey.Inventories
        ) as IPaginatedResponse<InventorySchema>
        this.inventories = data
        this.background = new ModalBackground({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 0,
                width,
                height,
            },
            options: {
                align: "center",
                container: {
                    showContainer: true,
                    showWrapperContainer: false,
                },
                background: Background.Small,
                onXButtonPress: (xButton: XButton) => {
                    onGameObjectPress({
                        gameObject: xButton,
                        scene: this.scene,
                        onPress: () => {
                            EventBus.emit(EventName.CloseModal, {
                                modalName: ModalName.SelectProduct,
                            })
                        },
                    })
                },
                title: "Select",
            },
        })
        this.scene.add.existing(this.background)
        this.addLocal(this.background)

        this.inventoryTypes = this.scene.cache.obj.get(CacheKey.InventoryTypes)
        this.scene.events.on(EventName.UpdateSelectProductModal, () => {
            const { index, isMore } = this.scene.cache.obj.get(
                CacheKey.DeliveryData
            ) as DeliveryData

            let inventoryTypeId: string | undefined
            if (isMore) {
                const inventories = getDeliveryInventories({
                    scene: this.scene,
                    inventories: this.inventories,
                })
                const inventory = inventories.find(
                    (inventory) => inventory.index === index
                )
                if (!inventory) {
                    throw new Error("Inventory not found")
                }
                inventoryTypeId = inventory.inventoryType
            }
            this.updateGridTable(inventoryTypeId)
        })

        EventBus.on(
            EventName.InventoriesRefreshed,
            (inventories: Array<InventorySchema>) => {
                this.inventories = inventories
            }
        )
    }

    private highlight() {
        if (!this.background.container) {
            throw new Error("Background container not found")
        }
        setTutorialDepth({
            gameObject: this.background.container,
        })

        if (!this.gridTable) {
            throw new Error("Grid table not found")
        }
        setTutorialDepth({
            gameObject: this.gridTable,
        })
    }

    private unhighlight() {
        if (!this.background.container) {
            throw new Error("Background container not found")
        }
        restoreTutorialDepth({
            gameObject: this.background.container,
        })

        if (!this.gridTable) {
            throw new Error("Grid table not found")
        }
        restoreTutorialDepth({
            gameObject: this.gridTable,
        })
    }

    private updateGridTable(inventoryTypeId?: string) {
        this._updateGridTable(inventoryTypeId)
        if (this.scene.cache.obj.get(CacheKey.TutorialActive)) {
            this.highlight()
        } else {
            if (!this.gridTable) {
                throw new Error("Grid table not found")
            }
            this.gridTable.setDepth(MODAL_DEPTH_2 + 1)
        }
    }

    private _updateGridTable(inventoryTypeId?: string) {
        const items = getProductInventories({
            scene: this.scene,
            inventories: this.inventories,
        })
        const productItems = items.filter(
            (item) =>
                (!inventoryTypeId || item.inventoryType === inventoryTypeId) &&
        item.kind === InventoryKind.Storage
        )
        if (this.gridTable) {
            this.gridTable.setItems(productItems)
            this.gridTable.layout()
            return
        }
        if (!this.background.containerImage) {
            throw new Error("Background container image not found")
        }
        this.gridTable = new GridTable<InventorySchema>({
            baseParams: {
                scene: this.scene,
                config: {
                    width: this.background.containerImage.width,
                    height: this.background.containerImage.height,
                    originY: 0,
                },
            },
            options: {
                columns: 3,
                createCellContainerCallback: (cell, cellContainer) => {
                    const background = new GridTableFrame({
                        scene: this.scene,
                        x: 0,
                        y: 0,
                    })
                    this.scene.add.existing(background)
                    if (cellContainer === null) {
                        const { quantity, inventoryType: inventoryTypeId } =
              cell.item as InventorySchema
                        const inventoryType = this.inventoryTypes.find(
                            ({ id }) => id === inventoryTypeId
                        )
                        if (!inventoryType) {
                            throw new Error("Inventory type not found")
                        }
                        const assetKey =
              inventoryTypeAssetMap[inventoryType.displayId].textureConfig.key
                        const itemQuantity = new ItemQuantity({
                            baseParams: {
                                scene: this.scene,
                                config: {
                                    width: this.cellSize.width,
                                    height: this.cellSize.height,
                                },
                            },
                            options: {
                                quantity,
                                assetKey,
                                showBadge: inventoryType.stackable,
                            },
                        }).layout()
                        this.scene.add.existing(itemQuantity)
                        this.gridMap[cell.index] = itemQuantity
                        cellContainer = this.scene.rexUI.add
                            .label({
                                width: this.cellSize.width,
                                height: this.cellSize.height,
                                background,
                                icon: itemQuantity,
                            })
                            .setDepth(MODAL_DEPTH_2 + 2)
                        cellContainer.setData(CELL_SELECT_PRODUCT_DATA_KEY, cell.item)
                    }
                    return cellContainer
                },
                items,
            },
        }).layout()

        this.gridTable.on("cell.click", (container: ContainerLite) => {
            if (!this.gridTable) {
                throw new Error("Grid table not found")
            }
            const inventory = container.getData(
                CELL_SELECT_PRODUCT_DATA_KEY
            ) as InventorySchema
            EventBus.emit(EventName.CloseModal, {
                modalName: ModalName.SelectProduct,
            })
            EventBus.emit(EventName.OpenModal, {
                modalName: ModalName.InputQuantity,
            })
            this.scene.events.emit(EventName.UpdateInputQuantityModal, {
                inventory,
            })

            if (this.scene.cache.obj.get(CacheKey.TutorialActive)) {
                this.unhighlight()
            }
        })
        this.scene.add.existing(this.gridTable)
        if (!this.background.container) {
            throw new Error("Background container not found")
        }
        this.background.container.addLocal(this.gridTable)
        return this.gridTable
    }
}
