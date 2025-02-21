import { InventoryKind } from "../enums"
import { AbstractSchema } from "./abstract"

export interface InventorySchema extends AbstractSchema {
    quantity: number
    user?: string
    inventoryType: string
    kind: InventoryKind
    index: number
}