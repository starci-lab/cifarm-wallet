import {
    ActionEmittedMessage,
    ActionName,
    BuyAnimalData,
    BuyBuildingData,
    BuyFruitData,
    BuyTileData,
    HarvestAnimalData,
    HarvestCropData,
    HarvestFruitData,
    SellData,
    ThiefAnimalProductData,
    ThiefCropData,
    ThiefFruitData,
} from "@/hooks"
import { sleep } from "@/modules/common"
import {
    Activities,
    AnimalSchema,
    BuildingSchema,
    CropSchema,
    FruitSchema,
    InventoryTypeSchema,
    PlacedItemSchema,
    PlacedItemType,
    PlacedItemTypeId,
    PlacedItemTypeSchema,
    ProductSchema,
    SupplySchema,
    TileSchema,
    ToolSchema,
    UserSchema,
} from "@/modules/entities"
import _ from "lodash"
import { DeepPartial } from "react-hook-form"
import { BaseAssetKey, productAssetMap } from "../assets"
import { FADE_HOLD_TIME, FADE_TIME } from "../constants"
import { EventBus, EventName, Position } from "../event-bus"
import { CacheKey, PlacedItemsData, TilemapBaseConstructorParams } from "../types"
import { GroundTilemap } from "./GroundTilemap"
import { PlacedItemObject } from "./PlacedItemObject"
import { LayerName, ObjectLayerName } from "./types"

const DEPTH_MULTIPLIER = 100
const EXPERIENCE_KEY = BaseAssetKey.UICommonExperience
const ENERGY_KEY = BaseAssetKey.UITopbarIconEnergy
const COIN_KEY = BaseAssetKey.UICommonIconCoin

export abstract class ItemTilemap extends GroundTilemap {
    // item layer
    private itemLayer: Phaser.Tilemaps.ObjectLayer
    // previous placed items
    private previousPlacedItemsData: PlacedItemsData | undefined

    // place item objects map
    protected placedItemObjectMap: Record<string, PlacedItemObjectData> = {}
    protected activities: Activities
    protected crops: Array<CropSchema>
    protected products: Array<ProductSchema>
    protected user: UserSchema
    protected animals: Array<AnimalSchema>
    protected fruits: Array<FruitSchema>
    protected buildings: Array<BuildingSchema>
    protected _tiles: Array<TileSchema>
    protected supplies: Array<SupplySchema>
    protected tools: Array<ToolSchema>
    protected placedItemTypes: Array<PlacedItemTypeSchema>
    protected inventoryTypes: Array<InventoryTypeSchema>

    constructor(baseParams: TilemapBaseConstructorParams) {
        super(baseParams)

        const itemLayer = this.getObjectLayer(ObjectLayerName.Item)
        if (!itemLayer) {
            throw new Error("Item layer not found")
        }
        this.itemLayer = itemLayer
        this.user = this.scene.cache.obj.get(CacheKey.User)
        this.activities = this.scene.cache.obj.get(CacheKey.Activities)
        this.crops = this.scene.cache.obj.get(CacheKey.Crops)
        this.products = this.scene.cache.obj.get(CacheKey.Products)
        this.buildings = this.scene.cache.obj.get(CacheKey.Buildings)
        this.animals = this.scene.cache.obj.get(CacheKey.Animals)
        this._tiles = this.scene.cache.obj.get(CacheKey.Tiles)
        this.supplies = this.scene.cache.obj.get(CacheKey.Supplies)
        this.tools = this.scene.cache.obj.get(CacheKey.Tools)
        this.placedItemTypes = this.scene.cache.obj.get(CacheKey.PlacedItemTypes)
        this.inventoryTypes = this.scene.cache.obj.get(CacheKey.InventoryTypes)
        this.fruits = this.scene.cache.obj.get(CacheKey.Fruits)

        EventBus.on(EventName.Visit, (user: UserSchema) => {
            // save to cache
            this.scene.cache.obj.add(CacheKey.WatchingUser, user)
            EventBus.emit(EventName.ProcessVisiting, true)
        })

        EventBus.on(EventName.ProcessVisiting, async () => {
            // console.log(toNeighbor)
            EventBus.emit(EventName.FadeIn)
            await sleep(FADE_TIME)
            EventBus.emit(EventName.UpdateWatchingStatus)
            // re-sync the placed items
            const watchingUser = this.scene.cache.obj.get(CacheKey.WatchingUser) as UserSchema | undefined 
            const userId = watchingUser?.id ?? undefined
            EventBus.emit(EventName.LoadPlacedItems1, userId)
            EventBus.emit(EventName.CenterCamera)
            await sleep(FADE_HOLD_TIME)
            EventBus.emit(EventName.FadeOut)
        })

        EventBus.on(EventName.PlacedItemsRefreshed, () => {
            //console.log("update placed items")
            const currentPlaceItemsData = this.getCurrentPlacedItemsData()
            // handle the placed items update
            this.handlePlacedItemsUpdate(currentPlaceItemsData, this.previousPlacedItemsData)
            // update the previous placed items
            this.previousPlacedItemsData = currentPlaceItemsData
        })

        EventBus.on(
            EventName.HandlePlacedItemUpdatePosition,
            (data: HandlePlacedItemUpdatePositionParams) => {
                this.handlePlacedItemUpdatePosition(data)
            }
        )

        const placedItemsData = this.getCurrentPlacedItemsData()
        if (placedItemsData) {
            // handle the placed items update
            this.handlePlacedItemsUpdate(placedItemsData, this.previousPlacedItemsData)
            // update the previous placed items
            this.previousPlacedItemsData = placedItemsData
        }

        EventBus.on(EventName.ActionEmitted, (data: ActionEmittedMessage) => {
            const { placedItem: { x, y} } = data
            if (x === undefined) {
                throw new Error("X is not found")
            }
            if (y === undefined) {
                throw new Error("Y is not found")
            }
            const tile = this.getTileCenteredAt({
                tileX: x,
                tileY: y,
                layer: LayerName.Ground,
            })
            if (!tile) {
                throw new Error("Tile not found")
            }
            const position = {
                x: tile.getCenterX() - this.tileWidth / 2,
                y: tile.getCenterY() - this.tileHeight / 2,
            }
            switch (data.action) {
            case ActionName.WaterCrop:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.waterCrop.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.waterCrop.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.WaterCrop,
                    })
                }
                break

            case ActionName.PlantSeed:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.plantSeed.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.plantSeed.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.PlantSeed,
                    })
                }
                break

            case ActionName.UsePesticide:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.usePesticide.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.usePesticide.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UsePesticide,
                    })
                }
                break
            case ActionName.HelpUsePesticide:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpUsePesticide.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.helpUsePesticide.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpUsePesticide,
                    })
                }
                break
            case ActionName.UseHerbicide:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.useHerbicide.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.useHerbicide.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UseHerbicide,
                    })
                }
                break
            case ActionName.HelpUseHerbicide:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpUseHerbicide.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.helpUseHerbicide.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UseFertilizer,
                    })
                }
                break
            case ActionName.UseFertilizer:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.useFertilizer.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.useFertilizer.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UseFertilizer,
                    })
                }
                break
            case ActionName.HarvestCrop:
                if (data.success) {
                    const { quantity, cropId } = data.data as HarvestCropData
                    const crop = this.crops.find((crop) => crop.id === cropId)
                    if (!crop) {
                        throw new Error("Crop not found")
                    }
                    const product = this.products.find(
                        (product) => product.crop === crop.id
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.harvestCrop.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.harvestCrop.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HarvestCrop,
                    })
                }
                break
            case ActionName.BuyTile:
                if (data.success) {
                    const { price } = data.data as BuyTileData
                    // get the tile position
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: COIN_KEY,
                            position,
                            quantity: -price,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.BuyTile,
                    })
                }
                break
            case ActionName.BuyAnimal:
                if (data.success) {
                    const { price } = data.data as BuyAnimalData
                    // get the tile position
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: COIN_KEY,
                            position,
                            quantity: -price,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.BuyAnimal,
                    })
                }
                break  
            case ActionName.BuyFruit:
                if (data.success) {
                    const { price } = data.data as BuyFruitData
                    // get the tile position
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: COIN_KEY,
                            position,
                            quantity: -price,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.BuyFruit,
                    })
                }
                break  
            case ActionName.BuyBuilding:
                if (data.success) {
                    const { price } = data.data as BuyBuildingData
                    // get the tile position
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: COIN_KEY,
                            position,
                            quantity: -price,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.BuyBuilding,
                    })
                }
                break    
            case ActionName.ThiefCrop:
                if (data.success) {
                    const { quantity, cropId } = data.data as ThiefCropData
                    const crop = this.crops.find((crop) => crop.id === cropId)
                    if (!crop) {
                        throw new Error("Crop not found")
                    }
                    const product = this.products.find(
                        (product) => product.crop === crop.id
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.thiefCrop.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.thiefCrop.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    switch (data.reasonCode) {
                    case 1:
                        this.scene.events.emit(EventName.CreateFlyItem, {
                            position,
                            text: "You are already thieved",
                        })
                        break
                    }
                }
                break
            case ActionName.CureAnimal:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.cureAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.cureAnimal.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.CureAnimal,
                    })
                }
                break
            case ActionName.FeedAnimal:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.feedAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.feedAnimal.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.FeedAnimal,
                    })
                }
                break
            case ActionName.HarvestAnimal:
                if (data.success) {
                    const { quantity, productId } = data.data as HarvestAnimalData
                    const product = this.products.find(
                        (product) => product.displayId === productId
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key

                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.harvestAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.harvestAnimal.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HarvestAnimal,
                    })
                }
                break
            case ActionName.HelpFeedAnimal:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.feedAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.feedAnimal.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpFeedAnimal,
                    })
                }
                break
            case ActionName.ThiefAnimalProduct:
                if (data.success) {
                    const { quantity, productId } = data.data as ThiefAnimalProductData
                    const product = this.products.find(
                        (product) => product.displayId === productId
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key

                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.thiefAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.thiefAnimal.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.ThiefAnimalProduct,
                    })
                }
                break
            case ActionName.HelpCureAnimal:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpCureAnimal.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.helpCureAnimal.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpCureAnimal,
                    })
                }
                break
            case ActionName.HelpWaterCrop:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpWaterCrop.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.helpWaterCrop.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpWaterCrop,
                    })
                }
                break
            case ActionName.Sell:
                if (data.success) {
                    const { quantity } = data.data as SellData
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: COIN_KEY,
                            position,
                            quantity: quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.Sell,
                    })
                }
                break

            case ActionName.HarvestFruit:
                if (data.success) {
                    const { quantity, productId } = data.data as HarvestFruitData
                    const product = this.products.find(
                        (product) => product.displayId === productId
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.harvestFruit.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.harvestFruit.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HarvestFruit,
                    })
                }
                break
            case ActionName.ThiefFruit:
                if (data.success) {
                    const { quantity, productId } = data.data as ThiefFruitData
                    const product = this.products.find(
                        (product) => product.displayId === productId
                    )
                    if (!product) {
                        throw new Error("Product not found")
                    }
                    const assetKey =
              productAssetMap[product.displayId].textureConfig.key
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.thiefFruit.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.thiefFruit.experiencesGain,
                        },
                        {
                            assetKey,
                            position,
                            quantity,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.ThiefFruit,
                    })
                }
                break
            case ActionName.UseBugNet:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.useBugNet.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.useBugNet.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UseBugNet,
                    })
                }
                break
            case ActionName.HelpUseFruitFertilizer:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpUseFruitFertilizer.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity:
                  this.activities.helpUseFruitFertilizer.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpUseFruitFertilizer,
                    })
                }
                break
            case ActionName.HelpUseBugNet:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.helpUseBugNet.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.helpUseBugNet.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.HelpUseBugNet,
                    })
                }
                break
            case ActionName.UseFruitFertilizer:
                if (data.success) {
                    this.scene.events.emit(EventName.CreateFlyItems, [
                        {
                            assetKey: ENERGY_KEY,
                            position,
                            quantity: -this.activities.useFruitFertilizer.energyConsume,
                        },
                        {
                            assetKey: EXPERIENCE_KEY,
                            position,
                            quantity: this.activities.useFruitFertilizer.experiencesGain,
                        },
                    ])
                } else {
                    this.scene.events.emit(EventName.CreateFlyItem, {
                        position,
                        text: "Failed to " + ActionName.UseFruitFertilizer,
                    })
                }
                break
            }
        })
    }

    public shutdown() {
        EventBus.off(EventName.PlacedItemsRefreshed)
        EventBus.off(EventName.RequestUpdatePlacedItemLocal)
    }

    // methods to handle changes in the placed items
    private handlePlacedItemsUpdate(
        current: PlacedItemsData,
        previous?: PlacedItemsData
    ) {
        //if current.userId doesn't match previous.userId, treat all placed items as new
        if (!previous || (previous && current.userId !== previous.userId)) {
            // if user ids are different, create all placed items (treat as new)
            this.clearAllPlacedItems()
            this.createAllPlacedItems(current.placedItems)
            return // exit early to avoid redundant checks later
        }
        // store the unchecked previous placed items
        const checkedPreviousPlacedItems: Array<PlacedItemSchema> = []

        for (const placedItem of current.placedItems) {
            // if previous doesn't exist or the placed item is not in previous placed items, treat it as new
            const found = previous.placedItems.find((item) => item.id === placedItem.id)
            if (found) {
                checkedPreviousPlacedItems.push(placedItem)
                if (placedItem.x !== found.x || placedItem.y !== found.y) {
                    console.log(
                        `Placing item ${placedItem.id} at ${placedItem.x},${placedItem.y}`
                    )
                    // place the item using the shared tile placing
                    this.placeTileForItem(placedItem)
                } else {
                    // if the placed item is in the previous placed items, update the item
                    const gameObject = this.placedItemObjectMap[placedItem.id]?.object
                    if (!gameObject) {
                        this.placeTileForItem(placedItem)
                        continue
                    }
                    gameObject.updateContent(placedItem)
                    // push the placed item to the checked previous placed items
                }
            } else {
                console.log(
                    `Placing item ${placedItem.id} at ${placedItem.x},${placedItem.y}`
                )
                // place the item using the shared tile placing
                this.placeTileForItem(placedItem)
            }
        }

        // remove the unchecked previous placed items that are no longer in the current placed items
        // Loop through previous placed items to remove any that are no longer present
        for (const placedItem of previous.placedItems) {
            // Check if this item exists in the checked items list
            if (
                !checkedPreviousPlacedItems.some((item) => item.id === placedItem.id)
            ) {
                console.log(
                    `Removing item ${placedItem.id} at ${placedItem.x},${placedItem.y}`
                )
                // remove the object from the item layer
                this.itemLayer.objects = this.itemLayer.objects.filter(
                    (object) => object.name !== placedItem.id
                )
                // remove the object from the tilemap
                const object = this.placedItemObjectMap[placedItem.id]?.object
                if (!object) {
                    throw new Error("Object not found")
                }
                object.clear(true)
                object.destroy()
            }
        }
    }

    protected clearPlacedItem(placedItem: PlacedItemSchema) {
        const gameObject = this.placedItemObjectMap[placedItem.id]?.object
        const placedItemType = this.placedItemTypes.find(
            (placedItemType) => placedItemType.id === placedItem.placedItemType
        )
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }
        gameObject.update(placedItemType.type, {
            ...placedItem,
            seedGrowthInfo: undefined,
            animalInfo: undefined,
            buildingInfo: undefined,
        })
    }

    private handlePlacedItemUpdatePosition({
        placedItemId,
        position,
    }: HandlePlacedItemUpdatePositionParams) {
        const placedItem = this.previousPlacedItemsData?.placedItems.find(
            (item) => item.id === placedItemId
        )
        if (!placedItem) {
            throw new Error("Placed item not found")
        }

        //remove old object
        this.itemLayer.objects = this.itemLayer.objects.filter(
            (object) => object.name !== placedItemId
        )
        this.placedItemObjectMap[placedItemId]?.object.destroy()

        // Place the item again at the new position
        this.placeTileForItem({
            ...placedItem,
            x: position.x,
            y: position.y,
        })
    }

    // method to create all placed items when user IDs differ
    private createAllPlacedItems(placedItems: Array<PlacedItemSchema>) {
        for (const placedItem of placedItems) {
            // Place the item using the shared tile placing logic
            this.placeTileForItem(placedItem)
        }
    }

    private clearAllPlacedItems() {
        for (const [, value] of Object.entries(this.placedItemObjectMap)) {
            value.object.destroyAll()
        }
        this.placedItemObjectMap = {}
    }

    //counter to keep track of the tile object id
    private tiledObjectId = 0

    // reusable method to place a tile for a given placed item
    protected placeTileForItem(placedItem: PlacedItemSchema) {
        // get the tile
        const tile = this.getTileCenteredAt({
            tileX: placedItem.x,
            tileY: placedItem.y,
            layer: this.groundLayer,
        })

        // check if the placed item is already in the map
        const gameObject = this.placedItemObjectMap[placedItem.id]?.object
        if (gameObject) {
            gameObject.clear(true)
            gameObject.destroy()
        }

        if (!tile) {
            throw new Error("Tile not found")
        }
        console.log(placedItem)
        // get the placed item type
        const placedItemType = this.placedItemTypes.find(
            (placedItemType) => placedItemType.id === placedItem.placedItemType
        )
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }
        // check if tile is home, then we move the camera to it
        if (placedItemType.id === PlacedItemTypeId.Home) {
            const tileAt = this.getTileAt(tile.x, tile.y)
            if (!tileAt) {
                throw new Error("Tile at x,y not found")
            }
        }

        // get the placed item type
        // Fill the area of the item, above the tile
        this.itemLayer.objects.push({
            id: this.tiledObjectId,
            name: placedItem.id,
            type: placedItemType.type,
            visible: true,
            width: 0,
            height: 0,
            ...this.computePositionForTiledObject(tile),
        })

        // create the objects
        const object = this.createFromObjects(ObjectLayerName.Item, {
            id: this.tiledObjectId,
            classType: PlacedItemObject,
        }).at(0) as PlacedItemObject | undefined
        if (!object) {
            throw new Error("Object not found")
        }
        object
            .setOrigin(1, 0.5)
            .setDepth((tile.x + tile.y + 1) * DEPTH_MULTIPLIER)
            .setScale(this.scale)
        // store the object in the placed item objects map
        this.placedItemObjectMap[placedItem.id] = {
            object,
            tileX: tile.x,
            tileY: tile.y,
            placedItemType,
            occupiedTiles: this.getOccupiedTiles(placedItem, placedItemType),
        }
        // update the object
        object.updateContent(placedItem)
        // increment the object id to ensure uniqueness
        this.tiledObjectId++
    }

    private getOccupiedTiles(
        placedItem: PlacedItemSchema,
        placedItemType: PlacedItemTypeSchema
    ) {
        const occupiedTiles: Array<Position> = []
        for (let dx = 0; dx < placedItemType.sizeX; dx++) {
            for (let dy = 0; dy < placedItemType.sizeY; dy++) {
                occupiedTiles.push({ x: placedItem.x - dx, y: placedItem.y - dy })
            }
        }
        return occupiedTiles
    }

    protected canPlaceItemAtTile({
        tileX,
        tileY,
        tileSizeWidth,
        tileSizeHeight,
    }: CanPlaceItemAtTileParams): boolean {
        const occupiedTiles: Array<Position> = _.flatMap(
            Object.values(this.placedItemObjectMap),
            (item) => item.occupiedTiles
        )
        const dragTiles: Array<Position> = _.range(tileSizeWidth).flatMap((dx) =>
            _.range(tileSizeHeight).map((dy) => ({ x: tileX - dx, y: tileY - dy }))
        )

        return !_.some(dragTiles, (tile) =>
            _.some(occupiedTiles, (occupiedTile) => _.isEqual(occupiedTile, tile))
        )
    }

    private getCurrentPlacedItemsData(): PlacedItemsData {
        const placedItemsData = this.scene.cache.obj.get(
            CacheKey.PlacedItems
        ) as PlacedItemsData
        const { placedItems: cachedPlacedItems, userId } = placedItemsData
        const placedItems = _.cloneDeep<Array<PlacedItemSchema>>(cachedPlacedItems)
        console.log(placedItems)
        return {
            placedItems,
            userId,
        }
    }

    // method to get the object at a given tile
    protected getObjectAtTile(
        tileX: number,
        tileY: number
    ): PlacedItemObjectData | null {
        const items = Object.values(this.placedItemObjectMap)
        const item = items.find(
            (item) => item.tileX === tileX && item.tileY === tileY
        )
        if (!item) {
            return null
        }
        const id = Object.keys(this.placedItemObjectMap).find(
            (key) => this.placedItemObjectMap[key] === item
        )
        if (!id) {
            throw new Error("ID not found")
        }
        return item
    }

    protected findPlacedItemRoot(
        x: number,
        y: number
    ): PlacedItemObjectData | null {
        for (const placedItem of Object.values(this.placedItemObjectMap)) {
            const { tileX, tileY, placedItemType } = placedItem
            const { sizeX, sizeY } = placedItemType
            if (!sizeX) {
                throw new Error("SizeX not found")
            }
            if (!sizeY) {
                throw new Error("SizeY not found")
            }
            if (x <= tileX && x > tileX - sizeX && y <= tileY && y > tileY - sizeY) {
                return placedItem
            }
        }
        return null
    }
}

export interface UpdatePlacedItemLocalParams {
  placedItem: DeepPartial<PlacedItemSchema>;
  type: PlacedItemType;
}

export interface PlacedItemObjectData {
  object: PlacedItemObject;
  tileX: number;
  tileY: number;
  placedItemType: PlacedItemTypeSchema;
  occupiedTiles: Array<Position>;
  pressBlocked?: boolean;
}

export interface CanPlaceItemAtTileParams {
  tileX: number;
  tileY: number;
  tileSizeWidth: number;
  tileSizeHeight: number;
}

export interface HandlePlacedItemUpdatePositionParams {
  placedItemId: string;
  position: Position;
}
