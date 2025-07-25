import { AnimalType, BuildingId, BuildingKind } from "@/types"
import { UpgradeSchema } from "./upgrade"
import { PlacedItemTypeSchema } from "./placed-item-type"
import { StaticAbstractSchema } from "./abstract"

export interface BuildingSchema extends StaticAbstractSchema<BuildingId> {
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    availableInShop: boolean
    animalContainedType?: AnimalType
    maxUpgrade: number
    unlockLevel: number
    price?: number
    sellable?: boolean
    sellPrice?: number
    upgrades?: Array<UpgradeSchema>
    upgradeIds: Array<string>
    upgradeable: boolean
    placedItemTypeId?: string
    placedItemType?: PlacedItemTypeSchema
    beeHouseYieldTime?: number
    beeHouseBasicHarvestExperiences?: number
    beeHouseQualityHarvestExperiences?: number
    baseHoneyYieldCoefficient?: number
    unique?: boolean
    kind: BuildingKind
}
