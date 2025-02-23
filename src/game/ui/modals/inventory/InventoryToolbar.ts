import { BaseAssetKey, inventoryTypeAssetMap } from "../../../assets"
import { IPaginatedResponse } from "@/modules/apollo"
import { InventorySchema, InventoryTypeSchema } from "@/modules/entities"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { GridSizer } from "phaser3-rex-plugins/templates/ui/ui-components"
import { CellSize, getCellSize, ItemQuantity } from "../../elements"
import { CacheKey } from "../../../types"
import { getToolInventories } from "../../../queries"
import { MODAL_DEPTH_1 } from "../ModalManager"
import { EventBus, EventName, RequestStorageInventoryIndexMessage, RequestToolbarInventoryIndexMessage } from "@/game/event-bus"
import { getDepth } from "./utils"
import { DragItemParams } from "./types"
import { CELL_TOOLBAR_DATA_KEY } from "./constants"
import { MoveInventoryRequest } from "@/modules/axios"
import { sleep } from "@/modules/common"
import { SCALE_TIME } from "@/game/constants"
import { setTutorialDepth } from "../../tutorial"

const TOOLBAR_COLUMN_COUNT = 4
const TOOLBAR_ROW_COUNT = 2
const TOOLBAR_CELL_COUNT = TOOLBAR_COLUMN_COUNT * TOOLBAR_ROW_COUNT

export class InventoryToolbar extends ContainerLite {
    private inventories: Array<InventorySchema> = []
    private inventoryTypes: Array<InventoryTypeSchema> = []
    private gridSizer: GridSizer | undefined
    private containers: Record<number, ContainerLite> = {}
    private tutorialEnabled = false
    private cellSize: CellSize

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // add toolbar
        const toolbarImage = scene.add.image(0,0, BaseAssetKey.UIModalInventoryToolbar).setOrigin(0.5, 1)
        // add chain
        const chainImage = scene.add.image(0, -(toolbarImage.height - 70), BaseAssetKey.UIModalInventoryChain).setOrigin(0.5, 1)
        // swap the chain and toolbar
        super(scene, x, y, toolbarImage.width, toolbarImage.height + chainImage.height - 70)
        this.cellSize = getCellSize(this.scene)

        this.addLocal(toolbarImage)
        this.addLocal(chainImage)
        this.bringChildToTop(toolbarImage)
        // add grass
        const grassImage = this.scene.add.image(0,0, BaseAssetKey.UIModalCommonGrass).setOrigin(0.5, 1)
        this.addLocal(grassImage)

        // fetch the inventories
        const { data } = this.scene.cache.obj.get(CacheKey.Inventories) as IPaginatedResponse<InventorySchema>
        this.inventories = data
        this.inventoryTypes = this.scene.cache.obj.get(CacheKey.InventoryTypes)

        this.updateGridSizer()

        EventBus.on(
            EventName.InventoriesRefreshed,
            ({ data }: IPaginatedResponse<InventorySchema>) => {
                this.inventories = data
                this.updateGridSizer()
            }
        ) 

        this.scene.events.on(EventName.RequestToolbarInventoryIndex, ({ pointer }: RequestToolbarInventoryIndexMessage) => {
            this.scene.events.emit(EventName.ToolbarInventoryIndexResponsed,  this.getPositionIndex(pointer))
        })

        this.scene.events.once(
            EventName.TutorialInventoryButtonPressed,
            async () => {
                await sleep(SCALE_TIME)
                this.tutorialEnabled = true
                this.highlight()
            }
        )

        this.scene.events.once(EventName.TutorialPrepareCloseInventory, () => {
            this.tutorialEnabled = false
            // rerender the grid sizer
            this.updateGridSizer()
        })
    }

    private highlight() {
        if (!this.gridSizer) {
            throw new Error("Grid table not found")
        }
        setTutorialDepth({
            gameObject: this.gridSizer,
            scene: this.scene,
            storeDepth: false,
        })
    }

    private computeIndex(x: number, y: number) {
        return y * TOOLBAR_COLUMN_COUNT + x
    }

    private updateGridSizer() {
        if (this.gridSizer) {
            this.remove(this.gridSizer, true)
        }
        const items = this.getToolItems()
        const background = this.scene.add.image(0, 0, BaseAssetKey.UIModalInventoryToolbarContainer)
        this.gridSizer = this.scene.rexUI.add
            .gridSizer({
                y: -150,
                originY: 1,
                space: {
                    column: 10,
                    row: 10,
                    top: 20, 
                    bottom: 20, 
                    left: 20, 
                    right: 20,
                },
                width: background.width,
                height: background.height,
                column: TOOLBAR_COLUMN_COUNT,
                row: TOOLBAR_ROW_COUNT,
                columnProportions: 1,
                rowProportions: 1,
                createCellContainerCallback: (scene, x, y, config) => {
                    config.expand = true
                    let gridTableCell: ItemQuantity | undefined
                    const inventory = items[y * TOOLBAR_COLUMN_COUNT + x]
                    const container = scene.rexUI.add
                        .container().setDepth(MODAL_DEPTH_1 + 1)
                    if (inventory) {
                        const inventoryType = this.inventoryTypes.find(
                            (inventoryType) => inventoryType.id === inventory.inventoryType
                        )
                        if (!inventoryType) {
                            throw new Error(
                                `Inventory type not found for inventory id: ${inventory.inventoryType}`
                            )
                        }
                        const {
                            textureConfig: { key },
                        } = inventoryTypeAssetMap[inventoryType.displayId]
                                    
                        const itemQuantity = new ItemQuantity({
                            baseParams: {
                                scene: this.scene,
                                config: {
                                    width: this.cellSize.width,
                                    height: this.cellSize.height,
                                }
                            },
                            options: {
                                assetKey: key,
                                quantity: inventory.quantity,
                                showBadge: inventoryType.stackable,
                            },
                        }).layout()
                        this.scene.add.existing(itemQuantity)
                        gridTableCell = itemQuantity
                        
                        // add drag to cell
                        itemQuantity.setInteractive().on("pointerdown", () => {
                            const dragItem = itemQuantity.duplicate()
                            // detach from the parent
                            const parent = itemQuantity.getParent()
                            if (!parent) {
                                throw new Error("Parent not found")
                            }
                            parent.remove(itemQuantity, true)
                            dragItem.setDepth(getDepth({
                                scene: this.scene,
                                tutorialEnabled: this.tutorialEnabled,
                                plus: 2
                            }))
                            this.scene.rexUI.add.drag(dragItem).drag()
                            dragItem.on("dragend", (pointer: Phaser.Input.Pointer) => {
                                if (!this.gridSizer) {
                                    throw new Error("Storage grid sizer not found")
                                }
                                dragItem.setDepth(getDepth({
                                    scene: this.scene,
                                    tutorialEnabled: this.tutorialEnabled,
                                    plus: 2
                                }))
                                this.dragItem({
                                    item: dragItem,
                                    pointer,
                                    data: inventory,
                                })
                            })
                        })
                    }
                    if (gridTableCell) {
                        container.add(gridTableCell)
                    }
                    container.setData(CELL_TOOLBAR_DATA_KEY, inventory)
                    this.containers[this.computeIndex(x, y)] = container
                    return container
                },
            }).addBackground(background)
            .layout().setDepth(getDepth({
                scene: this.scene,
                tutorialEnabled: this.tutorialEnabled,
                plus: 1
            }))
        this.addLocal(this.gridSizer)
        return this.gridSizer
    }

    private getToolItems() {
        const result: Array<InventorySchema | null> = []
        // filter all inventories based on the selected tab
        // create the inventory cells
        const toolbarInventories = getToolInventories({
            inventories: this.inventories,
            scene: this.scene,
        })
        for (let i = 0; i < TOOLBAR_CELL_COUNT; i++) {
            const inventory = toolbarInventories.find(
                (inventory) => inventory.index === i
            )
            result.push(inventory || null)
        }
        return result
    }

    // -1 indicate not found
    private getPositionIndex(pointer: Phaser.Input.Pointer) {
        for (let index = 0; index < Object.values(this.containers).length; index++) {
            const indexedCellContainer = this.containers[index]
            const inside = indexedCellContainer &&
            (indexedCellContainer as ContainerLite)
                .getBounds()
                .contains(pointer.x, pointer.y)
            if (!inside) continue
            // call api to move the inventory
            return index 
        }
        return -1
    }

    private async dragItem({ item, pointer, data }: DragItemParams) {
        let isTool = true
        let index = this.getPositionIndex(pointer)
        if (index === -1) {
            // Wrap the event in a Promise to use async/await
            index = await new Promise<number>((resolve) => {
                this.scene.events.once(EventName.StorageInventoryIndexResponsed, (result: number) => {
                    if (result !== -1) {
                        isTool = false
                    }
                    resolve(result) // Resolve the promise with the result
                })
                
                const eventMessage: RequestStorageInventoryIndexMessage = {
                    pointer
                }
                // Emit the event to request the toolbar inventory index
                this.scene.events.emit(EventName.RequestStorageInventoryIndex, eventMessage)
            })
        }
        if (index !== -1) {
            EventBus.once(EventName.MoveInventoryCompleted, () => {
                if (!item) {
                    throw new Error("Badge label not found")
                }
                if (this.scene.cache.obj.get(CacheKey.TutorialActive)) {
                // if (isTool) {
                //     this.inventorySeedMoveToToolbar = true
                //     this.tutorialEnabled = false
                // }
                }
                //  destroy the badge label
                item.destroy()
                EventBus.emit(EventName.RefreshInventories)
            })
            const eventMessage: MoveInventoryRequest = {
                index,
                isTool,
                inventoryId: data.id,
            }
            EventBus.emit(EventName.RequestMoveInventory, eventMessage)
        } else {
            //  destroy the badge label
            item.destroy()
            this.updateGridSizer()
        }
    }
}