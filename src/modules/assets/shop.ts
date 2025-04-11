import { AssetData, Metadata } from "./types"
import {
    CropId,
    FlowerId,
    AnimalId,
    BuildingId,
    FruitId,
    TileId,
    SupplyId,
    ToolId,
    PetId,
} from "../entities"
import { assetSuppliesMap } from "./supplies"
import { assetToolsMap } from "./tools"

export interface ShopData extends Metadata {
  base: AssetData;
}

export interface AssetShopData {
  crops: Partial<Record<CropId, ShopData>>;
  flowers: Partial<Record<FlowerId, ShopData>>;
  animals: Partial<Record<AnimalId, ShopData>>;
  buildings: Partial<Record<BuildingId, ShopData>>;
  fruits: Partial<Record<FruitId, ShopData>>;
  tiles: Partial<Record<TileId, ShopData>>;
  supplies: Partial<Record<SupplyId, ShopData>>;
  tools: Partial<Record<ToolId, ShopData>>;
  pets: Partial<Record<PetId, ShopData>>;
}

const PREFIX = "shop"
const PREFIX_CROPS = `${PREFIX}/crops`
const PREFIX_FLOWERS = `${PREFIX}/flowers`
const PREFIX_ANIMALS = `${PREFIX}/animals`
const PREFIX_BUILDINGS = `${PREFIX}/buildings`
const PREFIX_FRUITS = `${PREFIX}/fruits`
const PREFIX_TILES = `${PREFIX}/tiles`
const PREFIX_PETS = `${PREFIX}/pets`

export const assetShopMap: AssetShopData = {
    crops: {
        [CropId.Turnip]: {
            name: "Turnip seed",
            description:
        "A hardy root vegetable with a crisp texture and slightly peppery flavor.",
            base: {
                assetKey: "shop-turnip-seed",
                assetUrl: `${PREFIX_CROPS}/turnip.png`,
            },
        },
        [CropId.Carrot]: {
            name: "Carrot seed",
            description: "Sweet and crunchy root vegetable rich in beta-carotene.",
            base: {
                assetKey: "shop-carrot-seed",
                assetUrl: `${PREFIX_CROPS}/carrot.png`,
            },
        },
        [CropId.Potato]: {
            name: "Potato seed",
            description: "Versatile tuber crop with starchy texture.",
            base: {
                assetKey: "shop-potato-seed",
                assetUrl: `${PREFIX_CROPS}/potato.png`,
            },
        },
        [CropId.Pineapple]: {
            name: "Pineapple seed",
            description: "Tropical fruit with sweet, tangy flavor and spiky crown.",
            base: {
                assetKey: "shop-pineapple-seed",
                assetUrl: `${PREFIX_CROPS}/pineapple.png`,
            },
        },
        [CropId.Watermelon]: {
            name: "Watermelon seed",
            description: "Large, juicy fruit with sweet red flesh.",
            base: {
                assetKey: "shop-watermelon-seed",
                assetUrl: `${PREFIX_CROPS}/watermelon.png`,
            },
        },
        [CropId.Cucumber]: {
            name: "Cucumber seed",
            description: "Refreshing vegetable with crisp texture.",
            base: {
                assetKey: "shop-cucumber-seed",
                assetUrl: `${PREFIX_CROPS}/cucumber.png`,
            },
        },
        [CropId.BellPepper]: {
            name: "Bell Pepper seed",
            description: "Colorful vegetable with sweet, mild flavor.",
            base: {
                assetKey: "shop-bell-pepper-seed",
                assetUrl: `${PREFIX_CROPS}/bell-pepper.png`,
            },
        },
        [CropId.Strawberry]: {
            name: "Strawberry seed",
            description: "Sweet, red berry with juicy texture and small seeds.",
            base: {
                assetKey: "shop-strawberry-seed",
                assetUrl: `${PREFIX_CROPS}/strawberry.png`,
            },
        },
    },
    flowers: {
        [FlowerId.Daisy]: {
            name: "Daisy seed",
            description: "Classic white flower with yellow center.",
            base: {
                assetKey: "shop-daisy-seed",
                assetUrl: `${PREFIX_FLOWERS}/daisy.png`,
            },
        },
    },
    animals: {
        [AnimalId.Chicken]: {
            name: "Chicken",
            description: "Productive egg-laying bird.",
            base: {
                assetKey: "shop-chicken",
                assetUrl: `${PREFIX_ANIMALS}/chicken.png`,
            },
        },
        [AnimalId.Cow]: {
            name: "Cow",
            description: "Dairy-producing livestock.",
            base: {
                assetKey: "shop-cow",
                assetUrl: `${PREFIX_ANIMALS}/cow.png`,
            },
        },
    },
    buildings: {
        [BuildingId.Barn]: {
            name: "Barn",
            description: "Essential structure for housing and managing livestock.",
            base: {
                assetKey: "shop-barn",
                assetUrl: `${PREFIX_BUILDINGS}/barn.png`,
            },
        },
        [BuildingId.Coop]: {
            name: "Chicken Coop",
            description:
        "Secure housing for poultry with nesting boxes and roosting space.",
            base: {
                assetKey: "shop-coop",
                assetUrl: `${PREFIX_BUILDINGS}/coop.png`,
            },
        },
        [BuildingId.BeeHouse]: {
            name: "Bee House",
            description:
        "Specialized structure for honey production and pollination.",
            base: {
                assetKey: "shop-bee-house",
                assetUrl: `${PREFIX_BUILDINGS}/bee-house.png`,
            },
        },
        [BuildingId.PetHouse]: {
            name: "Pet House",
            description: "Comfortable shelter for farm pets with proper ventilation.",
            base: {
                assetKey: "shop-pet-house",
                assetUrl: `${PREFIX_BUILDINGS}/pet-house.png`,
            },
        },
    },
    fruits: {
        [FruitId.Apple]: {
            name: "Apple Tree",
            description: "Deciduous fruit tree producing seasonal harvests.",
            base: {
                assetKey: "shop-apple",
                assetUrl: `${PREFIX_FRUITS}/apple.png`,
            },
        },
        [FruitId.Banana]: {
            name: "Banana Tree",
            description: "Tropical fruit tree requiring warm climate conditions.",
            base: {
                assetKey: "shop-banana",
                assetUrl: `${PREFIX_FRUITS}/banana.png`,
            },
        },
    },
    tiles: {
        [TileId.BasicTile]: {
            name: "Basic Tile",
            description: "Standard farm plot for crop cultivation.",
            base: {
                assetKey: "shop-basic-tile",
                assetUrl: `${PREFIX_TILES}/basic-tile.png`,
            },
        },
    },
    supplies: Object.fromEntries(
        Object.entries(assetSuppliesMap).map(
            ([key, { base, name, description }]) => [key, { base, name, description }]
        )
    ),
    tools: Object.fromEntries(
        Object.entries(assetToolsMap).map(([key, { base, name, description }]) => [
            key,
            { base, name, description },
        ])
    ),
    pets: {
        [PetId.Dog]: {
            name: "Dog",
            description: "Loyal farm companion providing security and companionship.",
            base: {
                assetKey: "shop-dog",
                assetUrl: `${PREFIX_PETS}/dog.png`,
            },
        },
        [PetId.Cat]: {
            name: "Cat",
            description: "Natural pest controller and farm companion.",
            base: {
                assetKey: "shop-cat",
                assetUrl: `${PREFIX_PETS}/cat.png`,
            },
        },
    },
}
