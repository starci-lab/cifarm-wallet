import { StaticAbstractSchema } from "./abstract"
import { AnimalId, BuildingId, PlacedItemType, PlacedItemTypeId, TileId } from "../enums"

export interface PlacedItemTypeSchema extends StaticAbstractSchema {
    // override id to acheive the correct type
    id: PlacedItemTypeId
    type: PlacedItemType
    tile?: TileId
    building?: BuildingId
    animal?: AnimalId
}