import { useAppSelector } from "@/redux"
import React from "react"
import {
    DialogHeader,
    DialogTitle,
    ExtendedButton,
    GridTable,
    Spacer,
    Title,  
    DialogBody,
} from "@/components"
import {
    INVENTORY_MODAL_DISCLOSURE,
} from "@/singleton"
import { useSingletonHook } from "@/singleton"
import { Dialog, DialogContent } from "@/components"
import { useDisclosure } from "react-use-disclosure"
import { InventoryCard } from "./InventoryCard"
import { InventoryKind } from "@/types"
import { SortAscending, Trash } from "@phosphor-icons/react"
import { ExternalEventEmitter, ExternalEventName } from "@/modules/event-emitter"

export const InventoryModal = () => {
    const { isOpen, toggle } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(INVENTORY_MODAL_DISCLOSURE)

    const staticData = useAppSelector((state) => state.apiReducer.coreApi.static)

    const inventories = useAppSelector(
        (state) => state.apiReducer.coreApi.inventories ?? []
    )

    const storageInventories = Array.from(
        { length: staticData?.defaultInfo.storageCapacity ?? 0 },
        (_, index) => {
            const inventory =
        inventories.find(
            (inventory) =>
                inventory.kind === InventoryKind.Storage &&
            inventory.index === index
        ) ?? null
            return {
                index,
                kind: InventoryKind.Storage,
                inventory,
            }
        }
    )
    const toolInventories = Array.from(
        { length: staticData?.defaultInfo.toolCapacity ?? 0 },
        (_, index) => {
            const inventory =
        inventories.find(
            (inventory) =>
                inventory.kind === InventoryKind.Tool && inventory.index === index
        ) ?? null
            return {
                index,
                kind: InventoryKind.Tool,
                inventory: inventory,
            }
        }
    )
    const selectedInventory = useAppSelector(
        (state) => state.gameplayReducer.gameplaySelection.selectedPlacedItemId
    )
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Inventory</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        <Title
                            title="Tools"
                            tooltipString="Tools are used to harvest crops and other items."
                        />
                        <Spacer y={2} />
                        <GridTable
                            useContainer={true}
                            useGridWrap={true}
                            enableScroll={false}
                            items={toolInventories}
                            contentCallback={({ inventory, index, kind }) => (
                                <InventoryCard
                                    inventory={inventory}
                                    index={index}
                                    kind={kind}
                                />
                            )}
                            keyCallback={(item) => `${item.kind}-${item.index}`}
                        />
                    </div>
                    <Spacer y={4} />
                    <div>
                        <Title
                            title="Storage"
                            tooltipString="Storage is used to store items."
                        />
                        <Spacer y={2} />
                        <GridTable
                            useGridWrap={true}
                            useContainer={true}
                            classNames={{
                                scrollAreaWrapper: "max-h-[250px] h-[250px]",
                                scrollArea: "max-h-[calc(250px+32px)] h-[calc(250px+32px)]",
                            }}
                            enableScroll={true}
                            items={storageInventories}
                            contentCallback={({ inventory, index, kind }) => (
                                <InventoryCard
                                    inventory={inventory}
                                    index={index}
                                    kind={kind}
                                />
                            )}
                            keyCallback={(item) => `${item.kind}-${item.index}`}
                        />
                        <Spacer y={4} />
                        <div className="flex justify-end">
                            <div className="flex gap-2">
                                <ExtendedButton size="icon" variant="flat" color="secondary" onClick={() => {
                                    ExternalEventEmitter.emit(ExternalEventName.RequestSortInventories)
                                }}>
                                    <SortAscending  />
                                </ExtendedButton>
                                <ExtendedButton size="icon" variant="icon" color="destructive" onClick={() => {
                                    ExternalEventEmitter.emit(ExternalEventName.RequestDeleteInventory, {
                                        inventoryId: selectedInventory
                                    })
                                }}>
                                    <Trash  />
                                </ExtendedButton>
                            </div>
                        </div> 
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}
