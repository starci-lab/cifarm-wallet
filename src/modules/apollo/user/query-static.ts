import { gql } from "@apollo/client"
import { client } from "../client"
import { Activities, AnimalEntity, AnimalRandomness, BuildingEntity, CropEntity, CropRandomness, EnergyRegen, PlacedItemTypeEntity, SpinInfo, Starter } from "@/modules/entities"

//long query for querying all the static data
export const query = gql`
    {
        activities {
            water {
                experiencesGain
                energyConsume
            }
            feedAnimal {
                experiencesGain
                energyConsume
            }
            usePesticide {
                experiencesGain
                energyConsume
            }
            collectAnimalProduct {
                experiencesGain
                energyConsume
            }
            useFertilizer {
                experiencesGain
                energyConsume
            }
            useHerbicide {
                experiencesGain
                energyConsume
            }
            helpUseHerbicide {
                experiencesGain
                energyConsume
            }
            helpUsePesticide {
                experiencesGain
                energyConsume
            }
            helpWater {
                experiencesGain
                energyConsume
            }
            thiefCrop {
                experiencesGain
                energyConsume
            }
            thiefAnimalProduct {
                experiencesGain
                energyConsume
            }
            cureAnimal {
                experiencesGain
                energyConsume
            }
            helpCureAnimal {
                experiencesGain
                energyConsume
            }
            harvestCrop {
                experiencesGain
                energyConsume
            }
        }
        cropRandomness {
            thief3
            thief2
            needWater
            isWeedyOrInfested
        }
        animalRandomness {
            sickChance
            thief3
            thief2
        }
        starter {
            golds
        }
        spinInfo {
            appearanceChanceSlots {
                common {
                    count
                    thresholdMin
                    thresholdMax
                }
                rare {
                    count
                    thresholdMin
                    thresholdMax
                }
                uncommon {
                    count
                    thresholdMin
                    thresholdMax
                }
                veryRare {
                    count
                    thresholdMin
                    thresholdMax
                }
            }
        }
        energyRegen {
            time
        }
        placedItemTypes {
            createdAt
            updatedAt
            deletedAt
            id
            type
            tileId
            buildingId
            animalId
        }
        crops {
            createdAt
            updatedAt
            deletedAt
            id
            growthStageDuration
            growthStages
            price
            premium
            perennialCount
            nextGrowthStageAfterHarvest
            minHarvestQuantity
            maxHarvestQuantity
            basicHarvestExperiences
            premiumHarvestExperiences
            availableInShop
            productIds
            inventoryTypeId
            spinPrizeIds
        }
        animals {
            createdAt
            updatedAt
            deletedAt
            id
            yieldTime
            offspringPrice
            isNFT
            price
            growthTime
            availableInShop
            hungerTime
            qualityProductChanceStack
            qualityProductChanceLimit
            minHarvestQuantity
            maxHarvestQuantity
            basicHarvestExperiences
            premiumHarvestExperiences
            type
            productIds
            inventoryTypeId
            placedItemTypeId
        }
        buildings {
            createdAt
            updatedAt
            deletedAt
            id
            availableInShop
            type
            maxUpgrade
            price
            upgradeIds
            placedItemTypeId
        }
    }
`


export interface QueryStaticResponse {
    activities: Activities
    cropRandomness: CropRandomness
    animalRandomness: AnimalRandomness
    stater: Starter
    spinInfo: SpinInfo
    energyRegen: EnergyRegen
    placedItemTypes: Array<PlacedItemTypeEntity>
    crops: Array<CropEntity>
    animals: Array<AnimalEntity>
    buildings: Array<BuildingEntity>
}
export const queryStatic = async () => {
    return client.query<QueryStaticResponse>({
        query
    })
}
