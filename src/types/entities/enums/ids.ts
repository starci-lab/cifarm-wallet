// Animal Enum
export enum AnimalId {
    Chicken = "chicken",
    Cow = "cow",
}

// Building Enum
export enum BuildingId {
    Coop = "coop",
    Barn = "barn",
    Home = "home",
    BeeHouse = "beeHouse",
    PetHouse = "petHouse",
    FishPond = "fishPond",
}

// Upgrade Enum
export enum UpgradeId {
    CoopUpgrade1 = "coopUpgrade1",
    CoopUpgrade2 = "coopUpgrade2",
    CoopUpgrade3 = "coopUpgrade3",
    PastureUpgrade1 = "pastureUpgrade1",
    PastureUpgrade2 = "pastureUpgrade2",
    PastureUpgrade3 = "pastureUpgrade3",
    FishPondUpgrade1 = "fishPondUpgrade1",
    FishPondUpgrade2 = "fishPondUpgrade2",
    FishPondUpgrade3 = "fishPondUpgrade3",
}

// Crop Enum
export enum CropId {
    Turnip = "turnip",
    Carrot = "carrot",
    Potato = "potato",
    Pineapple = "pineapple",
    Watermelon = "watermelon",
    Cucumber = "cucumber",
    BellPepper = "bellPepper",
    Strawberry = "strawberry",
    Cauliflower = "cauliflower",
    Tomato = "tomato",
    Eggplant = "eggplant",
    Pumpkin = "pumpkin",
    Pea = "pea",
}

export enum FruitId {
    Banana = "banana",
    Apple = "apple",
    DragonFruit = "dragonFruit",
    //j97fruit
    Jackfruit = "jackfruit",
    Pomegranate = "pomegranate",
    Rambutan = "rambutan",
}

// Daily Reward Enum
export enum DailyRewardId {
    Day1 = "day1",
    Day2 = "day2",
    Day3 = "day3",
    Day4 = "day4",
    Day5 = "day5"
}

// Daily Reward Possibility Enum
export enum DailyRewardPossibilityId {
    Possibility1 = "possibility1",
    Possibility2 = "possibility2",
    Possibility3 = "possibility3",
    Possibility4 = "possibility4",
    Possibility5 = "possibility5"
}

// Supply Enum
export enum SupplyId {
    BasicFertilizer = "basicFertilizer",
    AnimalFeed = "animalFeed",
    FruitFertilizer = "fruitFertilizer",
}

// Tile Enum
export enum TileId {
    BasicTile = "basicTile",
}

// Tool Enum
export enum ToolId {
    Hand = "hand",
    Crate = "crate",
    WateringCan = "wateringCan",
    Herbicide = "herbicide",
    Pesticide = "pesticide",
    Hammer = "hammer",
    AnimalMedicine = "animalMedicine",
    BugNet = "bugNet",
}

// Product Enum
export enum ProductId {
    Egg = "egg",
    EggQuality = "eggQuality",
    Milk = "milk",
    MilkQuality = "milkQuality",
    Turnip = "turnip",
    TurnipQuality = "turnipQuality",
    Carrot = "carrot",
    CarrotQuality = "carrotQuality",
    Potato = "potato",
    PotatoQuality = "potatoQuality",
    Pineapple = "pineapple",
    PineappleQuality = "pineappleQuality",
    Watermelon = "watermelon",
    WatermelonQuality = "watermelonQuality",
    Cucumber = "cucumber",
    CucumberQuality = "cucumberQuality",
    BellPepper = "bellPepper",
    BellPepperQuality = "bellPepperQuality",
    Banana = "banana",
    BananaQuality = "bananaQuality",
    Apple = "apple",
    AppleQuality = "appleQuality",
    Daisy = "daisy",
    DaisyQuality = "daisyQuality",
    Strawberry = "strawberry",
    StrawberryQuality = "strawberryQuality",
    Honey = "honey",
    HoneyQuality = "honeyQuality",
    DragonFruit = "dragonFruit",
    DragonFruitQuality = "dragonFruitQuality",
    Jackfruit = "jackfruit",
    JackfruitQuality = "jackfruitQuality",
    Rambutan = "rambutan",
    RambutanQuality = "rambutanQuality",
    Pomegranate = "pomegranate",
    PomegranateQuality = "pomegranateQuality",
    Eggplant = "eggplant",
    EggplantQuality = "eggplantQuality",
    Pea = "pea",
    PeaQuality = "peaQuality",
    Tomato = "tomato",
    TomatoQuality = "tomatoQuality",
    Sunflower = "sunflower",
    SunflowerQuality = "sunflowerQuality",
    Pumpkin = "pumpkin",
    PumpkinQuality = "pumpkinQuality",
    Cauliflower = "cauliflower",
    CauliflowerQuality = "cauliflowerQuality",
}

export enum SystemId {
    Activities = "activities",
    CropRandomness = "cropRandomness",
    AnimalRandomness = "animalRandomness",
    Starter = "starter",
    EnergyRegen = "energyRegen",
}

export enum KeyValueStoreId {
    CropGrowthLastSchedule = "cropGrowthLastSchedule",
    AnimalGrowthLastSchedule = "animalGrowthLastSchedule",
    FruitGrowthLastSchedule = "fruitGrowthLastSchedule",
    EnergyRegenerationLastSchedule = "energyRegenerationLastSchedule"
}

export enum InventoryTypeId {
    TurnipSeed = "turnipSeed",
    CarrotSeed = "carrotSeed",
    PotatoSeed = "potatoSeed",
    PineappleSeed = "pineappleSeed",
    WatermelonSeed = "watermelonSeed",
    CucumberSeed = "cucumberSeed",
    BellPepperSeed = "bellPepperSeed",
    BasicFertilizer = "basicFertilizer",
    AnimalFeed = "animalFeed",
    FruitFertilizer = "fruitFertilizer",
    Egg = "egg",
    EggQuality = "eggQuality",
    Milk = "milk",
    MilkQuality = "milkQuality",
    Turnip = "turnip",
    TurnipQuality = "turnipQuality",
    Carrot = "carrot",
    CarrotQuality = "carrotQuality",
    Potato = "potato",
    PotatoQuality = "potatoQuality",
    Pineapple = "pineapple",
    PineappleQuality = "pineappleQuality",
    Watermelon = "watermelon",
    WatermelonQuality = "watermelonQuality",
    Cucumber = "cucumber",
    CucumberQuality = "cucumberQuality",
    BellPepper = "bellPepper",
    BellPepperQuality = "bellPepperQuality",
    Banana = "banana",
    BananaQuality = "bananaQuality",
    Apple = "apple",
    AppleQuality = "appleQuality",
    Hand = "hand",
    Crate = "crate",
    WateringCan = "wateringCan",
    Herbicide = "herbicide",
    Pesticide = "pesticide",
    Hammer = "hammer",
    AnimalMedicine = "animalMedicine",
    BugNet = "bugNet",
    Daisy = "daisy",
    DaisyQuality = "daisyQuality",
    DaisySeed = "daisySeed",
    StrawberrySeed = "strawberrySeed",
    Strawberry = "strawberry",
    StrawberryQuality = "strawberryQuality",
    Honey = "honey",
    HoneyQuality = "honeyQuality",
    DragonFruit = "dragonFruit",
    DragonFruitQuality = "dragonFruitQuality",
    Jackfruit = "jackfruit",
    JackfruitQuality = "jackfruitQuality",
    Rambutan = "rambutan",
    RambutanQuality = "rambutanQuality",
    Pomegranate = "pomegranate",
    PomegranateQuality = "pomegranateQuality",
    Eggplant = "eggplant",
    EggplantQuality = "eggplantQuality",
    Pea = "pea",
    PeaQuality = "peaQuality",
    Tomato = "tomato",
    TomatoQuality = "tomatoQuality",
    EggplantSeed = "eggplantSeed",
    PeaSeed = "peaSeed",
    TomatoSeed = "tomatoSeed",
    Sunflower = "sunflower",
    SunflowerQuality = "sunflowerQuality",
    Pumpkin = "pumpkin",
    PumpkinQuality = "pumpkinQuality",
}

export enum PlacedItemTypeId {
    Chicken = "chicken",
    Cow = "cow",
    Pig = "pig",
    Sheep = "sheep",
    Coop = "coop",
    Barn = "barn",
    Home = "home",
    BasicTile = "basicTile",
    BeeHouse = "beeHouse",
    PetHouse = "petHouse",
    DragonFruit = "dragonFruit",
    Jackfruit = "jackfruit",
    Banana = "banana",
    Apple = "apple",
    Pomegranate = "pomegranate",
    Rambutan = "rambutan",
    // terrain
    SmallStone = "smallStone",
    SmallGrassPatch = "smallGrassPatch",
    OakTree = "oakTree",
    PineTree = "pineTree",
    MapleTree = "mapleTree",
    // decorations
    WoodenFence = "woodenFence",
}

// Pet Enum
export enum PetId {
    Dog = "dog",
    Cat = "cat",
}

export enum FlowerId {
    Daisy = "daisy",
    Sunflower = "sunflower",
}

export enum TerrainId {
    SmallStone = "smallStone",
    SmallGrassPatch = "smallGrassPatch",
    OakTree = "oakTree",
    PineTree = "pineTree",
    MapleTree = "mapleTree",
}

export enum SeasonId {
    Season1 = "season1",
}

export enum DecorationId {
    WoodenFence = "woodenFence",
}