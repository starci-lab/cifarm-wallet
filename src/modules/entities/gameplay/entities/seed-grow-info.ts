import { UuidAbstractEntity } from "./abstract"
import { PlacedItemEntity } from "./placed-item"
import { UserEntity } from "./user"
import { CropCurrentState, CropId } from "../enums"
import { CropEntity } from "./crop"

export interface SeedGrowthInfoEntity extends UuidAbstractEntity {
    currentStage: number
    currentStageTimeElapsed: number
    currentPerennialCount: number
    harvestQuantityRemaining: number
    harvestCount: number
    isQuality: boolean
    cropId: CropId
    crop: CropEntity
    currentState: CropCurrentState
    thiefedBy: Array<UserEntity>
    isFertilized: boolean
    placedItemId: string
    placedItem?: PlacedItemEntity
}