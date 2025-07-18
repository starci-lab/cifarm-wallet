import { FruitId } from "@/types"
import { AssetData, AssetMapData, AssetMapType, BubbleStateConfig } from "./types"
import { getAssetUrl } from "./utils"

export interface FruitAssetMapData {
    mapData: AssetMapData
    bubbleStateConfig?: BubbleStateConfig
}
export interface AssetFruitData {
    name: string;
    phaser: {
        map: {
        stages: Record<number, FruitAssetMapData>
        }
    };
    base: {
        stages: Record<number, AssetData>
    };
}

const PREFIX = "/fruits"
// Fruit asset data map with the GID and asset URL for each fruit using FruitId as the key
export const assetFruitMap: Record<FruitId, AssetFruitData> = {
    [FruitId.Banana]: {
        name: "Banana",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-banana-1",
                                assetUrl: getAssetUrl(`${PREFIX}/banana/1.png`),
                                extraOffsets: {
                                    x: -20,
                                    y: -173,
                                }
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -100,
                            },
                        },
                    },  
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-banana-2",
                                assetUrl: getAssetUrl(`${PREFIX}/banana/2.png`),
                                extraOffsets: {
                                    x: -10,
                                    y: -175,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -110,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-banana-3",
                                assetUrl: getAssetUrl(`${PREFIX}/banana/3.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-banana-4",
                                assetUrl: getAssetUrl(`${PREFIX}/banana/4.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -175,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-banana-5",
                                assetUrl: getAssetUrl(`${PREFIX}/banana/5.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -175,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-banana-1",
                    assetUrl: getAssetUrl(`${PREFIX}/banana/1.png`),
                },
                1: {
                    assetKey: "fruit-banana-2",
                    assetUrl: getAssetUrl(`${PREFIX}/banana/2.png`),
                },
                2: {
                    assetKey: "fruit-banana-3",
                    assetUrl: getAssetUrl(`${PREFIX}/banana/3.png`),
                },
                3: {
                    assetKey: "fruit-banana-4",
                    assetUrl: getAssetUrl(`${PREFIX}/banana/4.png`),
                },
                4: {
                    assetKey: "fruit-banana-5",
                    assetUrl: getAssetUrl(`${PREFIX}/banana/5.png`),
                },
            },
        },
    },
    [FruitId.Apple]: {
        name: "Apple",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-apple-1",
                                assetUrl: getAssetUrl(`${PREFIX}/apple/1.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -190,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -10,
                                y: -100,
                            },
                        },
                    },
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-apple-2",
                                assetUrl: getAssetUrl(`${PREFIX}/apple/2.png`),
                                extraOffsets: {
                                    x: 10,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -10,
                                y: -100,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-apple-3",
                                assetUrl: getAssetUrl(`${PREFIX}/apple/3.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -150,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -50,
                                y: -150,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-apple-4",
                                assetUrl: getAssetUrl(`${PREFIX}/apple/4.png`),
                                extraOffsets: {
                                    x: 0,
                                    y: -150,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -50,
                                y: -150,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-apple-5",
                                assetUrl: getAssetUrl(`${PREFIX}/apple/5.png`),
                                extraOffsets: {
                                    x: -0,
                                    y: -150,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -50,
                                y: -150,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-apple-1",
                    assetUrl: getAssetUrl(`${PREFIX}/apple/1.png`),
                },
                1: {
                    assetKey: "fruit-apple-2",
                    assetUrl: getAssetUrl(`${PREFIX}/apple/2.png`),
                },
                2: {
                    assetKey: "fruit-apple-3",
                    assetUrl: getAssetUrl(`${PREFIX}/apple/3.png`),
                },
                3: {
                    assetKey: "fruit-apple-4",
                    assetUrl: getAssetUrl(`${PREFIX}/apple/4.png`),
                },
                4: {
                    assetKey: "fruit-apple-5",
                    assetUrl: getAssetUrl(`${PREFIX}/apple/5.png`),
                },
            },
        },
    },
    [FruitId.DragonFruit]: {
        name: "Dragon Fruit",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-dragon-fruit-1",
                                assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/1.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-dragon-fruit-2",
                                assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/2.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-dragon-fruit-3",
                                assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/3.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-dragon-fruit-4",
                                assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/4.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-dragon-fruit-5",
                                assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/5.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-dragon-fruit-1",
                    assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/1.png`),
                },
                1: {
                    assetKey: "fruit-dragon-fruit-2",
                    assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/2.png`),
                },
                2: {
                    assetKey: "fruit-dragon-fruit-3",
                    assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/3.png`),
                },
                3: {
                    assetKey: "fruit-dragon-fruit-4",
                    assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/4.png`),
                },
                4: {
                    assetKey: "fruit-dragon-fruit-5",
                    assetUrl: getAssetUrl(`${PREFIX}/dragon-fruit/5.png`),
                },
            },
        },
    },
    [FruitId.Jackfruit]: {
        name: "Jackfruit",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-jackfruit-1",
                                assetUrl: getAssetUrl(`${PREFIX}/jackfruit/1.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-jackfruit-2",
                                assetUrl: getAssetUrl(`${PREFIX}/jackfruit/2.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-jackfruit-3",
                                assetUrl: getAssetUrl(`${PREFIX}/jackfruit/3.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-jackfruit-4",
                                assetUrl: getAssetUrl(`${PREFIX}/jackfruit/4.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-jackfruit-5",
                                assetUrl: getAssetUrl(`${PREFIX}/jackfruit/5.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-jackfruit-1",
                    assetUrl: getAssetUrl(`${PREFIX}/jackfruit/1.png`),
                },
                1: {
                    assetKey: "fruit-jackfruit-2",
                    assetUrl: getAssetUrl(`${PREFIX}/jackfruit/2.png`),
                },
                2: {
                    assetKey: "fruit-jackfruit-3",
                    assetUrl: getAssetUrl(`${PREFIX}/jackfruit/3.png`),
                },
                3: {
                    assetKey: "fruit-jackfruit-4",
                    assetUrl: getAssetUrl(`${PREFIX}/jackfruit/4.png`),
                },
                4: {
                    assetKey: "fruit-jackfruit-5",
                    assetUrl: getAssetUrl(`${PREFIX}/jackfruit/5.png`),
                },
            },
        },
    },
    [FruitId.Pomegranate]: {
        name: "Pomegranate",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-pomegranate-1",
                                assetUrl: getAssetUrl(`${PREFIX}/pomegranate/1.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-pomegranate-2",
                                assetUrl: getAssetUrl(`${PREFIX}/pomegranate/2.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-pomegranate-3",
                                assetUrl: getAssetUrl(`${PREFIX}/pomegranate/3.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-pomegranate-4",
                                assetUrl: getAssetUrl(`${PREFIX}/pomegranate/4.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-pomegranate-5",
                                assetUrl: getAssetUrl(`${PREFIX}/pomegranate/5.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-pomegranate-1",
                    assetUrl: getAssetUrl(`${PREFIX}/pomegranate/1.png`),
                },
                1: {
                    assetKey: "fruit-pomegranate-2",
                    assetUrl: getAssetUrl(`${PREFIX}/pomegranate/2.png`),
                },
                2: {
                    assetKey: "fruit-pomegranate-3",
                    assetUrl: getAssetUrl(`${PREFIX}/pomegranate/3.png`),
                },
                3: {
                    assetKey: "fruit-pomegranate-4",
                    assetUrl: getAssetUrl(`${PREFIX}/pomegranate/4.png`),
                },
                4: {
                    assetKey: "fruit-pomegranate-5",
                    assetUrl: getAssetUrl(`${PREFIX}/pomegranate/5.png`),
                },
            },
        },
    },
    [FruitId.Rambutan]: {
        name: "Rambutan",
        phaser: {
            map: {
                stages: {
                    0: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-rambutan-1",
                                assetUrl: getAssetUrl(`${PREFIX}/rambutan/1.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    1: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-rambutan-2",
                                assetUrl: getAssetUrl(`${PREFIX}/rambutan/2.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    2: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-rambutan-3",
                                assetUrl: getAssetUrl(`${PREFIX}/rambutan/3.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    3: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-rambutan-4",
                                assetUrl: getAssetUrl(`${PREFIX}/rambutan/4.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                    4: {
                        mapData: {
                            type: AssetMapType.Texture,
                            texture: {
                                assetKey: "fruit-rambutan-5",
                                assetUrl: getAssetUrl(`${PREFIX}/rambutan/5.png`),
                                packageId: 1,
                                extraOffsets: {
                                    x: 0,
                                    y: -170,
                                },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -170,
                            },
                        },
                    },
                },
            },
        },
        base: {
            stages: {
                0: {
                    assetKey: "fruit-rambutan-1",
                    assetUrl: getAssetUrl(`${PREFIX}/rambutan/1.png`),
                },
                1: {
                    assetKey: "fruit-rambutan-2",
                    assetUrl: getAssetUrl(`${PREFIX}/rambutan/2.png`),
                },
                2: {
                    assetKey: "fruit-rambutan-3",
                    assetUrl: getAssetUrl(`${PREFIX}/rambutan/3.png`),
                },
                3: {
                    assetKey: "fruit-rambutan-4",
                    assetUrl: getAssetUrl(`${PREFIX}/rambutan/4.png`),
                },
                4: {
                    assetKey: "fruit-rambutan-5",
                    assetUrl: getAssetUrl(`${PREFIX}/rambutan/5.png`),
                },
            },
        },
    }
}