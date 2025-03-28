import {
    AnimalCurrentState,
    PlantCurrentState,
    FruitCurrentState,
    InventorySchema,
    InventoryType,
    PlacedItemSchema,
    PlacedItemType,
    PlacedItemTypeId,
    PlacedItemTypeSchema,
    SupplyId,
    SupplySchema,
    ToolId,
    ToolSchema,
    UserSchema,
    AbstractPlantSchema,
    PlantType,
    Position,
} from "@/modules/entities"
import { SpineGameObject } from "@esotericsoftware/spine-phaser"
import { Pinch, Tap } from "phaser3-rex-plugins/plugins/gestures"
import {
    AnimalAge,
    animalAssetMap,
    // AnimalAge,
    // animalAssetMap,
    BaseAssetKey,
    baseAssetMap,
    buildingAssetMap,
    fruitAssetMap,
    MainVisualType,
    SpineConfig,
    TextureConfig,
    tileAssetMap,
} from "../assets"
import { GREEN_TINT_COLOR, RED_TINT_COLOR } from "../constants"
import { CacheKey, TilemapBaseConstructorParams } from "../types"
import { ToolLike } from "../ui"
import { ItemTilemap, PlacedItemObjectData } from "./ItemTilemap"
import { PlacementConfirmation } from "./PlacementConfirmation"
import {
    BuyAnimalMessage,
    BuyBuildingMessage,
    BuyFruitMessage,
    BuyTileMessage,
    HarvestAnimalMessage,
    HarvestFruitMessage,
    HarvestPlantMessage,
    HelpUseAnimalMedicineMessage,
    HelpUseBugNetMessage,
    HelpUseHerbicideMessage,
    HelpUsePesticideMessage,
    HelpUseWateringCanMessage,
    MoveMessage,
    PlantSeedMessage,
    ThiefAnimalMessage,
    ThiefFruitMessage,
    ThiefPlantMessage,
    UseAnimalFeedMessage,
    UseAnimalMedicineMessage,
    UseBugNetMessage,
    UseFertilizerMessage,
    UseFruitFertilizerMessage,
    UseHerbicideMessage,
    UsePesticideMessage,
    UseWateringCanMessage,
} from "@/hooks"
import { setTintColorForSpriteOrSpine } from "./utils"
import {
    BuyingModeOnMessage,
    ExternalEventName,
    ModalName,
    OpenModalMessage,
    SceneEventEmitter,
    SceneEventName,
} from "../events"
import { ExternalEventEmitter } from "../events"
import { gameplayDepth } from "../depth"

export const POPUP_SCALE = 0.7
export const DRAG = "drag"

export enum InputMode {
  Normal,
  Buy,
  Move,
  Sell,
}

interface DragData {
  type: MainVisualType;
  textureConfig?: TextureConfig;
  spineConfig?: SpineConfig;
  placedItemType: PlacedItemTypeSchema;
}

export type BuyingDragData = DragData;
export interface MovingDragData extends DragData {
  objectData: PlacedItemObjectData;
}

// key for experience
const ENERGY_KEY = baseAssetMap[BaseAssetKey.UITopbarIconEnergy].key
// tilemap for handling input events
export class InputTilemap extends ItemTilemap {
    // pinch instance
    private pinch: Pinch | undefined
    private tap: Tap | undefined

    // input mode
    private inputMode = InputMode.Normal

    private minZoom = 0.5
    private maxZoom = 5
    // place item data
    private buyingDragData: BuyingDragData | undefined
    private movingDragData: MovingDragData | undefined

    private isDragging = false
    private dragBuyVisual:
    | Phaser.GameObjects.Sprite
    | SpineGameObject
    | undefined
    private placementConfirmation: PlacementConfirmation | undefined
    constructor(baseParams: TilemapBaseConstructorParams) {
        super(baseParams)

        // listen for place in progress event
        SceneEventEmitter.on(SceneEventName.NormalModeOn, () => {
            this.cancelPlacement()
        })

        SceneEventEmitter.on(SceneEventName.BuyingModeOn, (data: BuyingModeOnMessage) => {
            this.hideEverything()
            this.inputMode = InputMode.Buy
            this.handleBuyingMode(data)
        })
        SceneEventEmitter.on(SceneEventName.MovingModeOn, () => {
            this.hideEverything()
            this.inputMode = InputMode.Move
        })
        SceneEventEmitter.on(SceneEventName.SellingModeOn, () => {
            this.hideEverything()
            this.inputMode = InputMode.Sell
        })

        this.user = this.scene.cache.obj.get(CacheKey.User) as UserSchema

        this.addInputs()
    }

    private addInputs() {
        this.pinch = new Pinch(this.scene)
        const camera = this.scene.cameras.main
        // add event listener for pinch gesture
        this.pinch.on("drag1", (dragScale: Pinch) => {
            const drag1Vector = dragScale.drag1Vector
            const previousScrollX = camera.scrollX
            const previousScrollY = camera.scrollY
            camera.scrollX -= drag1Vector.x / camera.zoom
            camera.scrollY -= drag1Vector.y / camera.zoom
            // reset if current not stay in tilemap
            if (!this.getTileAtWorldXY(camera.scrollX, camera.scrollY)) {
                camera.scrollX = previousScrollX
                camera.scrollY = previousScrollY
            }
        })

        // add event listener for pinch gesture
        this.pinch.on("pinch", (dragScale: Pinch) => {
            const scaleFactor = dragScale.scaleFactor
            const zoom = Math.max(
                this.minZoom,
                Math.min(this.maxZoom, camera.zoom * scaleFactor)
            )
            camera.setZoom(zoom)
        })
        //add event listener for mouse wheel event
        this.scene.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: Array<Phaser.GameObjects.GameObject>,
                dx: number,
                dy: number
            ) => {
                //zoom in
                if (dy < 0) {
                    const zoom = Math.min(this.maxZoom, camera.zoom + 0.1)
                    camera.setZoom(zoom)
                }
                //zoom out
                else {
                    const zoom = Math.max(this.minZoom, camera.zoom - 0.1)
                    camera.setZoom(zoom)
                }
            }
        )

        // click on empty tile to plant seed
        this.tap = new Tap(this.scene)
        this.tap.on("tap", (pointer: Phaser.Input.Pointer) => {
            const tile = this.getTileAtWorldXY(pointer.worldX, pointer.worldY)
            // do nothing if tile is not found
            if (!tile) {
                return
            }

            //if buying mode is on
            if (this.inputMode === InputMode.Buy) {
                return
            }

            console.log(tile.x, tile.y)
            const data = this.findPlacedItemRoot(tile.x, tile.y)

            if (!data) {
                console.log("No placed item found for position")
                return
            }

            data.object.showTimer()

            if (this.inputMode === InputMode.Move) {
                if (!this.isDragging) {
                    this.isDragging = true
                    if (!data.object.currentPlacedItem?.id) {
                        throw new Error("Placed item id not found")
                    }
                    data.object.ignoreCollision = true
                    this.handleMovingDragMode(data)
                    return
                }
            }

            if (this.inputMode === InputMode.Sell) {
                const placedItem = data.object.currentPlacedItem

                if (!placedItem) {
                    throw new Error("Placed item id not found")
                }

                this.handleSellingMode({
                    placedItem,
                })
                return
            }

            if (!data.object.placedItemType) {
                throw new Error("Placed item type not found")
            }

            // return if object is pressed for action
            if (data.object.isPressedForAction) {
                return
            }
            switch (data.object.placedItemType.type) {
            case PlacedItemType.Tile:
                this.handlePressOnTile(data)
                break
            case PlacedItemType.Building:
                if (data.object.placedItemType.displayId == PlacedItemTypeId.Home)
                    return
                this.handlePressOnBuilding(data)
                break
            case PlacedItemType.Animal:
                this.handlePressOnAnimal(data)
                break
            case PlacedItemType.Fruit:
                this.handlePressOnFruit(data)
                break
            }
        })
    }
    // method to handle press on tile
    private async handlePressOnTile(data: PlacedItemObjectData) {
    // check if current is visited or not
        if (!data.object.placedItemType) {
            throw new Error("Placed item type not found")
        }
        if (data.object.placedItemType.type !== PlacedItemType.Tile) {
            throw new Error("Invalid placed item type")
        }
        const watchingUser = this.scene.cache.obj.get(
            CacheKey.WatchingUser
        ) as UserSchema
        const selectedTool = this.scene.cache.obj.get(
            CacheKey.SelectedTool
        ) as ToolLike

        // do nothing if selected tool is default
        if (selectedTool.default) {
            return
        }

        const inventoryType = this.inventoryTypes.find(
            (inventoryType) => inventoryType.id === selectedTool.inventoryType?.id
        )
        if (!inventoryType) {
            throw new Error(
                `Inventory type not found for inventory id: ${selectedTool.inventoryType}`
            )
        }
        const object = data.object
        const currentPlacedItem = object.currentPlacedItem

        const placedItemId = currentPlacedItem?.id
        // do nothing if placed item id is not found
        if (!placedItemId) {
            return
        }

        switch (inventoryType.type) {
        case InventoryType.Seed: {
        // return if seed growth info is found
            if (currentPlacedItem?.plantInfo) {
                return
            }

            // do nothing if neighbor user id is found
            if (watchingUser) {
                return
            }

            if (
                !this.energyNotEnough({
                    data,
                    actionEnergy: this.activities.plantSeed.energyConsume,
                })
            ) {
                return
            }

            const inventories = this.scene.cache.obj.get(
                CacheKey.Inventories
            ) as Array<InventorySchema>
            const inventory = inventories.find(
                (inventory) => inventory.id === selectedTool.id
            )

            if (!inventory) {
                throw new Error(
                    `Inventory not found for inventory id: ${selectedTool.id}`
                )
            }

            // emit the event to plant seed
            const eventMessage: PlantSeedMessage = {
                inventorySeedId: selectedTool.id,
                placedItemTileId: placedItemId,
            }
            ExternalEventEmitter.emit(
                ExternalEventName.RequestPlantSeed,
                eventMessage
            )
            object.setIsPressedForAction()
            break
        }
        case InventoryType.Tool: {
            const tools = this.scene.cache.obj.get(
                CacheKey.Tools
            ) as Array<ToolSchema>
            if (!tools) {
                throw new Error("Tools not found")
            }
            const tool = tools.find(
                (tool) => tool.id === selectedTool.inventoryType?.id
            )
            if (!tool) {
                throw new Error(`Tool not found for tool id: ${selectedTool.id}`)
            }
            // check if tool id is water can
            switch (tool.displayId) {
            case ToolId.WateringCan: {
                if (
                    currentPlacedItem.plantInfo?.currentState !==
              PlantCurrentState.NeedWater
                ) {
                    return
                }

                if (watchingUser) {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy:
                    this.activities.helpUseWateringCan.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: HelpUseWateringCanMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHelpUseWateringCan,
                        eventMessage
                    )
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.useWateringCan.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: UseWateringCanMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseWateringCan,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            case ToolId.Pesticide: {
            // return if seed growth info is not need water
                if (
                    currentPlacedItem.plantInfo?.currentState !==
              PlantCurrentState.IsInfested
                ) {
                    return
                }
                if (watchingUser) {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.helpUsePesticide.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to help use pesticide
                    const eventMessage: HelpUsePesticideMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHelpUsePesticide,
                        eventMessage
                    )
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.usePesticide.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: UsePesticideMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUsePesticide,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            case ToolId.Herbicide: {
            // return if seed growth info is not need water
                if (
                    currentPlacedItem.plantInfo?.currentState !==
              PlantCurrentState.IsWeedy
                ) {
                    return
                }

                if (watchingUser) {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.helpUseHerbicide.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: HelpUseHerbicideMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHelpUseHerbicide,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.useHerbicide.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: UseHerbicideMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseHerbicide,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            case ToolId.Crate: {
            // return if seed growth info is not need water
                if (
                    currentPlacedItem.plantInfo?.currentState !==
              PlantCurrentState.FullyMatured
                ) {
                    return
                }
                const placedItem = object.currentPlacedItem
                if (!placedItem) {
                    throw new Error("Placed item not found")
                }
                if (watchingUser) {
                    if (
                        !this.thiefPlantQuantityReactMinimum({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.hasThievedPlant({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.thiefPlant.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: ThiefPlantMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestThiefPlant,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    // emit the event to water the plant
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.harvestPlant.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: HarvestPlantMessage = {
                        placedItemTileId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHarvestPlant,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            }
            break
        }
        case InventoryType.Supply: {
            const supplies = this.scene.cache.obj.get(
                CacheKey.Supplies
            ) as Array<SupplySchema>

            if (!supplies) {
                throw new Error("Supplies not found")
            }

            const supply = supplies.find(
                (supply) => supply.id === selectedTool.inventoryType?.id
            )

            if (!supply) {
                throw new Error(`Supply not found for supply id: ${selectedTool.id}`)
            }

            switch (supply.displayId) {
            case SupplyId.BasicFertilizer: {
            // return if seed growth info is not need water
                if (currentPlacedItem.plantInfo == null) {
                    return
                }

                if (currentPlacedItem.plantInfo?.isFertilized) {
                    return
                }

                if (
                    !this.energyNotEnough({
                        data,
                        actionEnergy: this.activities.useFertilizer.energyConsume,
                    })
                ) {
                    return
                }

                // emit the event to plant seed
                const eventMessage: UseFertilizerMessage = {
                    placedItemTileId: placedItemId,
                    inventorySupplyId: selectedTool.id,
                }
                ExternalEventEmitter.emit(
                    ExternalEventName.RequestUseFertilizer,
                    eventMessage
                )
                object.setIsPressedForAction()
                break
            }
            }
        }
        }
    }

    //handlePressOnAnimal
    private async handlePressOnAnimal(data: PlacedItemObjectData) {
        if (!data.object.placedItemType) {
            throw new Error("Placed item type not found")
        }
        if (data.object.placedItemType.type !== PlacedItemType.Animal) {
            throw new Error("Invalid placed item type")
        }
        const watchingUser = this.scene.cache.obj.get(
            CacheKey.WatchingUser
        ) as UserSchema
        const selectedTool = this.scene.cache.obj.get(
            CacheKey.SelectedTool
        ) as ToolLike

        // do nothing if selected tool is default
        if (selectedTool.default) {
            return
        }

        const inventoryType = this.inventoryTypes.find(
            (inventoryType) => inventoryType.id === selectedTool.inventoryType?.id
        )
        if (!inventoryType) {
            throw new Error(
                `Inventory type not found for inventory id: ${selectedTool.inventoryType}`
            )
        }
        const object = data.object
        const currentPlacedItem = object.currentPlacedItem

        const placedItemId = currentPlacedItem?.id
        // do nothing if placed item id is not found
        if (!placedItemId) {
            return
        }

        switch (inventoryType.type) {
        case InventoryType.Supply: {
            const supply = this.supplies.find(
                (supply) => supply.id === selectedTool.inventoryType?.id
            )
            if (!supply) {
                throw new Error(`Supply not found for supply id: ${selectedTool.id}`)
            }
            switch (supply.displayId) {
            case SupplyId.AnimalFeed: {
                if (!currentPlacedItem?.animalInfo) {
                    return
                }
                // do nothing if neighbor user id is found
                if (watchingUser) {
                    // do nothing in neighbor mode
                    return
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.useAnimalFeed.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: UseAnimalFeedMessage = {
                        inventorySupplyId: selectedTool.id,
                        placedItemAnimalId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseAnimalFeed,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }

                break
            }
            }
            break
        }
        case InventoryType.Tool: {
            const tool = this.tools.find(
                (tool) => tool.id === selectedTool.inventoryType?.id
            )
            if (!tool) {
                throw new Error(`Tool not found for tool id: ${selectedTool.id}`)
            }
            switch (tool.displayId) {
            case ToolId.AnimalMedicine: {
                if (!currentPlacedItem?.animalInfo) {
                    return
                }
                if (watchingUser) {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy:
                    this.activities.helpUseAnimalMedicine.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: HelpUseAnimalMedicineMessage = {
                        placedItemAnimalId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHelpUseAnimalMedicine,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy:
                    this.activities.helpUseAnimalMedicine.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: UseAnimalMedicineMessage = {
                        placedItemAnimalId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseAnimalMedicine,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }

                break
            }
            case ToolId.Crate: {
            // return if seed growth info is not need water
                if (
                    currentPlacedItem.animalInfo?.currentState !==
              AnimalCurrentState.Yield
                ) {
                    return
                }
                if (watchingUser) {
                    if (
                        !this.thiefAnimalQuantityReactMinimum({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.hasThievedAnimalProduct({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.thiefAnimal.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to water the plant
                    // emit the event to plant seed
                    const eventMessage: ThiefAnimalMessage = {
                        placedItemAnimalId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestThiefAnimal,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    // emit the event to water the plant
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.harvestAnimal.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: HarvestAnimalMessage = {
                        placedItemAnimalId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHarvestAnimal,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            }
            break
        }
        }
    }

    private getAssetConfigFromPlacedItem(placedItemType: PlacedItemTypeSchema) {
        let _mainVisualType: MainVisualType | undefined
        let _textureConfig: TextureConfig | undefined
        let _spineConfig: SpineConfig | undefined
        switch (placedItemType.type) {
        case PlacedItemType.Building: {
            const building = this.buildings.find(
                (building) => building.id === placedItemType?.building
            )
            if (!building) {
                throw new Error("Building not found")
            }
            const { textureConfig, spineConfig, mainVisualType } =
          buildingAssetMap[building.displayId].map
            switch (mainVisualType) {
            case MainVisualType.Spine:
                _mainVisualType = MainVisualType.Spine
                _spineConfig = spineConfig
                break
            default:
                _mainVisualType = MainVisualType.Sprite
                _textureConfig = textureConfig
                break
            }
            break
        }
        case PlacedItemType.Tile: {
            const tile = this._tiles.find(
                (tile) => tile.id === placedItemType?.tile
            )
            if (!tile) {
                throw new Error("Tile not found")
            }
            const { textureConfig } = tileAssetMap[tile.displayId]
            _mainVisualType = MainVisualType.Sprite
            _textureConfig = textureConfig
            break
        }
        case PlacedItemType.Animal: {
            const animal = this.animals.find(
                (animal) => animal.id === placedItemType?.animal
            )
            if (!animal) {
                throw new Error("Animal not found")
            }
            const { spineConfig, mainVisualType } =
          animalAssetMap[animal.displayId].map[AnimalAge.Baby]
            _spineConfig = spineConfig
            _mainVisualType = mainVisualType
            break
        }
        case PlacedItemType.Fruit: {
            const fruit = this.fruits.find(
                (fruit) => fruit.id === placedItemType?.fruit
            )
            if (!fruit) {
                throw new Error("Fruit not found")
            }
            const { textureConfig } = fruitAssetMap[fruit.displayId].map[0]
            _mainVisualType = MainVisualType.Sprite
            _textureConfig = textureConfig
            break
        }
        }

        if (!_mainVisualType) {
            throw new Error("Main visual type not found")
        }

        return {
            mainVisualType: _mainVisualType,
            textureConfig: _textureConfig,
            spineConfig: _spineConfig,
        }
    }

    private handleMovingDragMode(data: PlacedItemObjectData) {
        const { object } = data
        const { placedItemType } = object
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }
        const { mainVisualType, textureConfig, spineConfig } =
      this.getAssetConfigFromPlacedItem(placedItemType)

        this.movingDragData = {
            type: mainVisualType,
            textureConfig,
            spineConfig,
            placedItemType,
            objectData: data,
        }
    }

    private handleBuyingMode({ placedItemTypeId }: BuyingModeOnMessage) {
        const placedItemType = this.placedItemTypes.find(
            (placedItemType) => placedItemType.id === placedItemTypeId
        )
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }

        const { mainVisualType, textureConfig, spineConfig } =
      this.getAssetConfigFromPlacedItem(placedItemType)

        this.buyingDragData = {
            type: mainVisualType,
            textureConfig,
            spineConfig,
            placedItemType,
        }
    }

    private handleSellingMode({ 
        placedItem }: HandleSellingModeParams) {
        console.log(placedItem)
    //     if (!placedItem) {
    //         throw new Error("Placed item not found")
    //     }
    //     const data = this.placedItemObjectMap[placedItem.id]
    //     if (!data) {
    //         return
    //     }
    //     const currentPlacedItem = data.object.currentPlacedItem
    //     if (!currentPlacedItem) {
    //         throw new Error("Current placed item not found")
    //     }
    //     const placedItemType = this.placedItemTypes.find(
    //         (placedItemType) => placedItemType.id === currentPlacedItem.placedItemType
    //     )
    //     if (!placedItemType) {
    //         throw new Error("Placed item type not found")
    //     }
    //     let sellPrice: number = 0
    //     if (!placedItemType.sellable) {
    //         return
    //     }
    //     switch (placedItemType.type) {
    //     case PlacedItemType.Building: {
    //         const building = this.buildings.find(
    //             (building) =>
    //                 building.displayId.toString() ===
    //         placedItemType.displayId.toString()
    //         )
    //         if (!building) {
    //             throw new Error("Building not found")
    //         }
    //         const upgradeLevel =
    //       currentPlacedItem?.buildingInfo?.currentUpgrade ?? 1
    //         const upgradePrice =
    //       building.upgrades?.find(
    //           (upgrade) => upgrade.upgradeLevel === upgradeLevel
    //       )?.sellPrice ?? 0
    //         sellPrice = upgradePrice
    //         break
    //     }
    //     case PlacedItemType.Tile: {
    //         const tile = this._tiles.find(
    //             (tile) =>
    //                 tile.displayId.toString() === placedItemType.displayId.toString()
    //         )
    //         if (!tile) {
    //             throw new Error("Tile not found")
    //         }
    //         sellPrice = tile.sellPrice ?? 0
    //         break
    //     }
    //     case PlacedItemType.Animal: {
    //         const animal = this.animals.find(
    //             (animal) =>
    //                 animal.displayId.toString() === placedItemType.displayId.toString()
    //         )
    //         if (!animal) {
    //             throw new Error("Animal not found")
    //         }
    //         sellPrice = animal.sellPrice ?? 0
    //         break
    //     }
    //     }
    //     if (placedItemType.sellable) {
    //         // const updateConfirmSellModalMessage: UpdateConfirmSellModalMessage = {
    //         //     message: "Are you sure you want to sell this item?",
    //         //     quantity: sellPrice,
    //         //     callback: () => {
    //         //         const eventMessage = {
    //         //             placedItemId: placedItem.id,
    //         //         }
    //         //         ExternalEventEmitter.emit(ExternalEventName.RequestSell, eventMessage)
    //         //     },
    //         // }
    //         // SceneEventEmitter.emit(
    //         //     SceneEventName.UpdateConfirmSellModal,
    //         //     updateConfirmSellModalMessage
    //         // )
    //     } else {
    //         console.error("Not sellable")
    //         return
    //     }
    }
    // update method to handle input events
    public update() {
    // console.log(this.pinch?.pointers.map(x => `${x.x} ${x.y}`))
    //check current mouse position is in which tile
        if (this.inputMode === InputMode.Buy) {
            const camera = this.scene.cameras.main
            const { x, y } = this.scene.input.activePointer.positionToCamera(
                camera
            ) as Phaser.Math.Vector2
            const tile = this.getTileAtWorldXY(x, y)
            // do nothing if tile is not found
            if (!tile) {
                return
            }
            // place the item temporarily on the tile
            this.dragBuyingSpriteOnTile(tile)
        }
        if (this.inputMode === InputMode.Move) {
            if (!this.isDragging) {
                return
            }
            const camera = this.scene.cameras.main
            const { x, y } = this.scene.input.activePointer.positionToCamera(
                camera
            ) as Phaser.Math.Vector2
            const tile = this.getTileAtWorldXY(x, y)
            // do nothing if tile is not found
            if (!tile) {
                return
            }
            this.dragMovingObjectOnTile(tile)
        }
    }

    // drag sprite on tile
    private dragBuyingSpriteOnTile(tile: Phaser.Tilemaps.Tile) {
    // throw error if drag sprite data is not found
        if (!this.buyingDragData) {
            throw new Error("No drag sprite data found")
        }
        const { placedItemType, textureConfig, spineConfig, type } =
      this.buyingDragData

        const position = this.getActualTileCoordinates(tile.x, tile.y)

        const isPlacementValid = this.canPlaceItemAtTile({
            tileX: position.x,
            tileY: position.y,
            tileSizeWidth: placedItemType.sizeX,
            tileSizeHeight: placedItemType.sizeY,
        })
        switch (type) {
        case MainVisualType.Spine: {
            const { x = 0, y = 0 } = { ...spineConfig?.extraOffsets }
            if (!spineConfig) {
                throw new Error("Spine config not found")
            }
            //render spine animation
            if (!this.dragBuyVisual) {
                this.dragBuyVisual = this.scene.add
                    .spine(x, y, spineConfig.json.key, spineConfig.atlas.key)
                    .setDepth(gameplayDepth.drag)
                    .setOrigin(0.5, 1)
                this.dragBuyVisual.animationState.setAnimation(0, "idle", true)
            }
            break
        }
        case MainVisualType.Sprite: {
            const { x = 0, y = 0 } = { ...textureConfig?.extraOffsets }
            if (!textureConfig) {
                throw new Error("Texture config not found")
            }
            if (!this.dragBuyVisual) {
                this.dragBuyVisual = this.scene.add
                    .sprite(x, y, textureConfig.key)
                    .setDepth(gameplayDepth.drag)
                    .setOrigin(0.5, 1)
            }
            break
        }
        }
        // update the temporary place item object position
        const tilePosition = this.tileToWorldXY(tile.x, tile.y)
        if (!tilePosition) {
            throw new Error("Position not found")
        }
        this.showPlacmentConfirmation({
            tile,
            onCancel: () => {
                this.cancelPlacement()
                SceneEventEmitter.emit(SceneEventName.PlacedItemsRefreshed)
            },
            onConfirm: (tileX: number, tileY: number) => {
                // show modal
                switch (placedItemType.type) {
                case PlacedItemType.Building: {
                    const building = this.buildings.find(
                        (building) => building.id === placedItemType.building
                    )
                    if (!building) {
                        throw new Error(
                            `Building not found for id: ${placedItemType.building}`
                        )
                    }
                    const eventMessage: BuyBuildingMessage = {
                        buildingId: building.displayId,
                        position: {
                            x: tileX,
                            y: tileY,
                        },
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestBuyBuilding,
                        eventMessage
                    )
                    break
                }
                case PlacedItemType.Tile: {
                    const tile = this._tiles.find(
                        (tile) => tile.id === placedItemType.tile
                    )
                    if (!tile) {
                        throw new Error(`Tile not found for id: ${placedItemType.tile}`)
                    }
                    const eventMessage: BuyTileMessage = {
                        tileId: tile.displayId,
                        position: {
                            x: tileX,
                            y: tileY,
                        },
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestBuyTile,
                        eventMessage
                    )
                    break
                }
                case PlacedItemType.Animal: {
                    const animal = this.animals.find(
                        (animal) => animal.id === placedItemType.animal
                    )
                    if (!animal) {
                        throw new Error(
                            `Animal not found for id: ${placedItemType.tile}`
                        )
                    }
                    const eventMessage: BuyAnimalMessage = {
                        animalId: animal.displayId,
                        position: {
                            x: tileX,
                            y: tileY,
                        },
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestBuyAnimal,
                        eventMessage
                    )
                    break
                }
                case PlacedItemType.Fruit: {
                    const fruit = this.fruits.find(
                        (fruit) => fruit.id === placedItemType.fruit
                    )
                    if (!fruit) {
                        throw new Error(
                            `Fruit not found for id: ${placedItemType.fruit}`
                        )
                    }
                    const eventMessage: BuyFruitMessage = {
                        fruitId: fruit.displayId,
                        position: {
                            x: tileX,
                            y: tileY,
                        },
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestBuyFruit,
                        eventMessage
                    )
                    break
                }
                }
            },
        })
        if (!this.placementConfirmation) {
            throw new Error("Placement confirmation not found")
        }
        this.placementConfirmation.setYesButtonVisible(isPlacementValid)
        const { x: centeredX, y: centeredY } = this.getActualTileCoordinates(
            tile.x,
            tile.y
        )
        this.placementConfirmation.updateTileXY(centeredX, centeredY)

        const { x = 0, y = 0 } = { ...textureConfig?.extraOffsets }
        // set tint based on can place

        setTintColorForSpriteOrSpine(
            this.dragBuyVisual,
            isPlacementValid ? GREEN_TINT_COLOR : RED_TINT_COLOR
        )
        this.dragBuyVisual.setPosition(
            tilePosition.x + x * this.scale,
            tilePosition.y + (this.tileHeight / 2) * this.scale + y * this.scale
        )
    }

    private dragMovingObjectOnTile(tile: Phaser.Tilemaps.Tile) {
    // throw error if drag sprite data is not found
        if (!this.movingDragData) {
            throw new Error("No drag sprite data found")
        }
        const { placedItemType, objectData } = this.movingDragData
        if (!objectData) {
            throw new Error("Object data not found")
        }
        const { object } = objectData

        const position = this.getActualTileCoordinates(tile.x, tile.y)

        const isPlacementValid = this.canPlaceItemAtTile({
            tileX: position.x,
            tileY: position.y,
            tileSizeWidth: placedItemType.sizeX,
            tileSizeHeight: placedItemType.sizeY,
        })

        // set the depth of the object
        object.setDepth(gameplayDepth.drag)

        // update the temporary place item object position
        const tilePosition = this.tileToWorldXY(tile.x, tile.y)
        if (!tilePosition) {
            throw new Error("Position not found")
        }
        this.showPlacmentConfirmation({
            tile,
            onCancel: () => {
                // cancel state by
                this.cancelPlacement()
                if (!objectData.object.currentPlacedItem?.id) {
                    throw new Error("Placed item id not found")
                }
                this.deleteObject(objectData.object.currentPlacedItem.id)
                SceneEventEmitter.emit(SceneEventName.PlacedItemsRefreshed)
            },
            onConfirm: (tileX: number, tileY: number) => {
                // this.movingDragSpriteData = undefined
                if (!objectData.object.currentPlacedItem?.id) {
                    throw new Error("Placed item id not found")
                }
                this.deleteObject(objectData.object.currentPlacedItem.id)
                // check if the object is same position
                if (
                    objectData.object.currentPlacedItem?.x === tileX &&
          objectData.object.currentPlacedItem?.y === tileY
                ) {
                    SceneEventEmitter.emit(SceneEventName.PlacedItemsRefreshed)
                } else {
                    const moveRequest: MoveMessage = {
                        placedItemId: objectData.object.currentPlacedItem?.id,
                        position: {
                            x: tileX,
                            y: tileY,
                        },
                    }
                    ExternalEventEmitter.emit(ExternalEventName.RequestMove, moveRequest)
                }
                this.cancelPlacement()
            },
        })

        if (!this.placementConfirmation) {
            throw new Error("Placement confirmation not found")
        }
        this.placementConfirmation.setYesButtonVisible(isPlacementValid)
        const { x: centeredX, y: centeredY } = this.getActualTileCoordinates(
            tile.x,
            tile.y
        )
        this.placementConfirmation.updateTileXY(centeredX, centeredY)
        // set tint based on can place
        object.setTint(isPlacementValid ? GREEN_TINT_COLOR : RED_TINT_COLOR)
        object.setPosition(tilePosition.x, tilePosition.y + this.tileHeight / 2)
    }

    private showPlacmentConfirmation({
        tile,
        onCancel,
        onConfirm,
    }: ShowPlacmentConfirmationParams) {
        const tilePosition = this.tileToWorldXY(tile.x, tile.y)

        if (!tilePosition) {
            throw new Error("Position not found")
        }

        if (!this.placementConfirmation) {
            this.placementConfirmation = new PlacementConfirmation({
                baseParams: {
                    scene: this.scene,
                },
                options: {
                    onCancel,
                    onConfirm,
                },
            }).setDepth(
                gameplayDepth.placementConfirmation
            )
            this.scene.add.existing(this.placementConfirmation)
        }
        this.placementConfirmation.setPosition(tilePosition.x, tilePosition.y)
    }

    private handlePressOnBuilding(data: PlacedItemObjectData) {
        if (!data.object.placedItemType) {
            throw new Error("Placed item type not found")
        }
        if (data.object.placedItemType.type !== PlacedItemType.Building) {
            throw new Error("Invalid placed item type")
        }

        const selectedTool = this.scene.cache.obj.get(
            CacheKey.SelectedTool
        ) as ToolLike

        // do nothing if selected tool is default
        if (selectedTool.default) {
            return
        }

        const inventoryType = this.inventoryTypes.find(
            (inventoryType) => inventoryType.id === selectedTool.inventoryType?.id
        )
        if (!inventoryType) {
            throw new Error(
                `Inventory type not found for inventory id: ${selectedTool.inventoryType}`
            )
        }
        const object = data.object
        const currentPlacedItem = object.currentPlacedItem

        const placedItemId = currentPlacedItem?.id
        // do nothing if placed item id is not found
        if (!placedItemId) {
            return
        }

        switch (inventoryType.type) {
        case InventoryType.Tool: {
            const tools = this.scene.cache.obj.get(
                CacheKey.Tools
            ) as Array<ToolSchema>
            if (!tools) {
                throw new Error("Tools not found")
            }
            const tool = tools.find(
                (tool) => tool.id === selectedTool.inventoryType?.id
            )
            if (!tool) {
                throw new Error(`Tool not found for tool id: ${selectedTool.id}`)
            }
            // check if tool id is water can
            switch (tool.displayId) {
            case ToolId.Hammer: {
                const eventMessage: OpenModalMessage = {
                    modalName: ModalName.UpgradeBuilding,
                }
                SceneEventEmitter.emit(SceneEventName.OpenModal, eventMessage)
            // SceneEventEmitter.emit(
            //     SceneEventName.UpdateUpgadeBuildingModal,
            //     currentPlacedItem
            // )
            }
            }
        }
        }
    }

    private handlePressOnFruit(data: PlacedItemObjectData) {
        if (!data.object.placedItemType) {
            throw new Error("Placed item type not found")
        }
        if (data.object.placedItemType.type !== PlacedItemType.Fruit) {
            throw new Error("Invalid placed item type")
        }
        const watchingUser = this.scene.cache.obj.get(
            CacheKey.WatchingUser
        ) as UserSchema
        const selectedTool = this.scene.cache.obj.get(
            CacheKey.SelectedTool
        ) as ToolLike

        // do nothing if selected tool is default
        if (selectedTool.default) {
            return
        }

        const inventoryType = this.inventoryTypes.find(
            (inventoryType) => inventoryType.id === selectedTool.inventoryType?.id
        )
        if (!inventoryType) {
            throw new Error(
                `Inventory type not found for inventory id: ${selectedTool.inventoryType}`
            )
        }
        const object = data.object
        const currentPlacedItem = object.currentPlacedItem

        const placedItemId = currentPlacedItem?.id
        // do nothing if placed item id is not found
        if (!placedItemId) {
            return
        }

        switch (inventoryType.type) {
        case InventoryType.Tool: {
            const tools = this.scene.cache.obj.get(
                CacheKey.Tools
            ) as Array<ToolSchema>
            if (!tools) {
                throw new Error("Tools not found")
            }
            const tool = tools.find(
                (tool) => tool.id === selectedTool.inventoryType?.id
            )
            if (!tool) {
                throw new Error(`Tool not found for tool id: ${selectedTool.id}`)
            }
            // check if tool id is water can
            switch (tool.displayId) {
            case ToolId.BugNet: {
            // return if seed growth info is not need water
                if (
                    currentPlacedItem.fruitInfo?.currentState !==
              FruitCurrentState.IsBuggy
                ) {
                    return
                }

                if (watchingUser) {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.helpUseBugNet.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: HelpUseBugNetMessage = {
                        placedItemFruitId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHelpUseBugNet,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.useBugNet.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: UseBugNetMessage = {
                        placedItemFruitId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseBugNet,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            case ToolId.Crate: {
                if (
                    currentPlacedItem.fruitInfo?.currentState !==
              FruitCurrentState.FullyMatured
                ) {
                    return
                }
                if (watchingUser) {
                    if (
                        !this.thiefFruitQuantityReactMinimum({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.hasThievedFruit({
                            data,
                        })
                    ) {
                        return
                    }
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.thiefFruit.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to water the plant
                    // emit the event to plant seed
                    const eventMessage: ThiefFruitMessage = {
                        placedItemFruitId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestThiefFruit,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                } else {
                    // emit the event to water the plant
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy: this.activities.harvestFruit.energyConsume,
                        })
                    ) {
                        return
                    }
                    // emit the event to plant seed
                    const eventMessage: HarvestFruitMessage = {
                        placedItemFruitId: placedItemId,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestHarvestFruit,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            }
            break
        }
        case InventoryType.Supply: {
            const supply = this.supplies.find(
                (supply) => supply.id === selectedTool.inventoryType?.id
            )
            if (!supply) {
                throw new Error(`Supply not found for supply id: ${selectedTool.id}`)
            }
            switch (supply.displayId) {
            case SupplyId.FruitFertilizer: {
                if (!currentPlacedItem?.fruitInfo) {
                    return
                }
                // do nothing if neighbor user id is found
                if (watchingUser) {
                    return
                } else {
                    if (
                        !this.energyNotEnough({
                            data,
                            actionEnergy:
                    this.activities.useFruitFertilizer.energyConsume,
                        })
                    ) {
                        return
                    }

                    // emit the event to plant seed
                    const eventMessage: UseFruitFertilizerMessage = {
                        placedItemFruitId: placedItemId,
                        inventorySupplyId: selectedTool.id,
                    }
                    ExternalEventEmitter.emit(
                        ExternalEventName.RequestUseFruitFertilizer,
                        eventMessage
                    )
                    object.setIsPressedForAction()
                }
                break
            }
            }
            break
        }
        }
    }

    private cancelPlacement() {
        this.showEverything()
        this.destroyDragVisual()
        this.inputMode = InputMode.Normal
        this.placementConfirmation?.removeAll(true)
        this.placementConfirmation?.destroy()
        this.placementConfirmation = undefined
        this.isDragging = false
    }

    // destroy method to clean up the resources
    public destroyDragVisual() {
        this.dragBuyVisual?.destroy()
        this.dragBuyVisual = undefined
    // remove the temporary object from the temporary layer
    }

    private hasThievedPlant({ data }: HasThievedPlantParams): boolean {
        if (
            data.object.currentPlacedItem?.plantInfo?.thieves.includes(this.user.id)
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    showIcon: false,
                    x: position.x,
                    y: position.y,
                    text: "You are already thieved",
                },
            ])
            return false
        }
        return true
    }

    private hasThievedAnimalProduct({
        data,
    }: HasThievedAnimalProductParams): boolean {
        if (
            data.object.currentPlacedItem?.animalInfo?.thieves.includes(this.user.id)
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    showIcon: false,
                    x: position.x,
                    y: position.y,
                    text: "You are already thieved",
                },
            ])
            return false
        }
        return true
    }
    //has thieved fruit
    private hasThievedFruit({ data }: HasThievedFruitParams): boolean {
        if (
            data.object.currentPlacedItem?.fruitInfo?.thieves.includes(this.user.id)
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    showIcon: false,
                    x: position.x,
                    y: position.y,
                    text: "You are already thieved",
                },
            ])
            return false
        }
        return true
    }

    private thiefPlantQuantityReactMinimum({
        data,
    }: ThiefPlantQuantityReactMinimumParams): boolean {
        let plant: AbstractPlantSchema | undefined
        switch (data.object.currentPlacedItem?.plantInfo?.plantType) {
        case PlantType.Crop: {
            plant = this.crops.find(
                (crop) => crop.id === data.object.currentPlacedItem?.plantInfo?.crop
            )
            break
        }
        case PlantType.Flower: {
            plant = this.flowers.find(
                (flower) =>
                    flower.id === data.object.currentPlacedItem?.plantInfo?.flower
            )
            break
        }
        }
        if (!plant) {
            throw new Error("Plant not found")
        }
        if (
            plant.minHarvestQuantity >=
      (data.object?.currentPlacedItem?.plantInfo?.harvestQuantityRemaining || 0)
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    x: position.x,
                    y: position.y,
                    text: "Minimum quantity reached",
                },
            ])
            return false
        }
        return true
    }

    private thiefAnimalQuantityReactMinimum({
        data,
    }: ThiefAnimalQuantityReactMinimumParams): boolean {
        const placedItemType = this.placedItemTypes.find(
            (placedItemType) =>
                placedItemType.id === data.object.currentPlacedItem?.placedItemType
        )
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }
        const animal = this.animals.find(
            (animal) => animal.id === placedItemType.animal
        )
        if (!animal) {
            throw new Error("Animal not found")
        }
        if (!data.object.currentPlacedItem?.animalInfo?.harvestQuantityRemaining) {
            throw new Error("Harvest quantity remaining not found")
        }
        if (
            animal.minHarvestQuantity >=
      data.object.currentPlacedItem.animalInfo.harvestQuantityRemaining
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    showIcon: false,
                    x: position.x,
                    y: position.y,
                    text: "Minimum quantity reached",
                },
            ])
            return false
        }
        return true
    }

    private thiefFruitQuantityReactMinimum({
        data,
    }: ThiefFruitQuantityReactMinimumParams): boolean {
        const placedItemType = this.placedItemTypes.find(
            (placedItemType) =>
                placedItemType.id === data.object.currentPlacedItem?.placedItemType
        )
        if (!placedItemType) {
            throw new Error("Placed item type not found")
        }
        const fruit = this.fruits.find(
            (fruit) => fruit.id === placedItemType.fruit
        )
        if (!fruit) {
            throw new Error("Fruit not found")
        }
        if (!data.object.currentPlacedItem?.fruitInfo?.harvestQuantityRemaining) {
            throw new Error("Harvest quantity remaining not found")
        }
        if (
            fruit.minHarvestQuantity >=
      data.object.currentPlacedItem.fruitInfo.harvestQuantityRemaining
        ) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    showIcon: false,
                    x: position.x,
                    y: position.y,
                    text: "Minimum quantity reached",
                },
            ])
            return false
        }
        return true
    }

    private energyNotEnough({
        data,
        actionEnergy = 0,
    }: EnergyNotEnoughParams): boolean {
        if (this.user.energy < actionEnergy) {
            const position = data.object.getCenter()
            this.createFlyItems([
                {
                    iconAssetKey: ENERGY_KEY,
                    x: position.x,
                    y: position.y,
                    text: "Not enough",
                },
            ])
            return false
        }
        return true
    }

    private hideEverything() {  
        SceneEventEmitter.emit(SceneEventName.ShowPlacementModeButtons)
        SceneEventEmitter.emit(SceneEventName.HideToolbar)
        SceneEventEmitter.emit(SceneEventName.HideButtons)
    }
    private showEverything() {
        SceneEventEmitter.emit(SceneEventName.HidePlacementModeButtons)
        SceneEventEmitter.emit(SceneEventName.ShowToolbar)
        SceneEventEmitter.emit(SceneEventName.ShowButtons)
    }
}

export interface PlacedItemTintParams {
  placedItem: PlacedItemSchema;
}
export interface HasThievedPlantParams {
  data: PlacedItemObjectData;
}

export interface HasThievedAnimalProductParams {
  data: PlacedItemObjectData;
}
//HasThievedFruitParams
export interface HasThievedFruitParams {
  data: PlacedItemObjectData;
}

export interface ThiefPlantQuantityReactMinimumParams {
  data: PlacedItemObjectData;
}

export interface ThiefAnimalQuantityReactMinimumParams {
  data: PlacedItemObjectData;
}

export interface ThiefFruitQuantityReactMinimumParams {
  data: PlacedItemObjectData;
}

export interface EnergyNotEnoughParams {
  data: PlacedItemObjectData;
  actionEnergy: number;
}

export interface PlayProductFlyAnimationParams {
  position: Position;
  assetKey: string;
  quantity: number;
}

export interface ShowPlacmentConfirmationParams {
  tile: Phaser.Tilemaps.Tile;
  onConfirm: (tileX: number, tileY: number) => void;
  onCancel: () => void;
}

export interface HandleMovingModeParams {
  data: PlacedItemObjectData;
}

export interface HandleSellingModeParams {
  placedItem: PlacedItemSchema;
}

export interface UpdatePlacedItemColorParams {
  placedItem?: PlacedItemSchema;
}
