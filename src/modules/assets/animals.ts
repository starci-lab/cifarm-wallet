import { AnimalId } from "@/types"
import { AssetMapData, AssetMapType, BubbleStateConfig } from "./types"
import { getAssetUrl } from "./utils"

export enum AnimalAge {
    Baby = "baby",
    Adult = "adult",
}

export interface AnimalAssetMapData {
    mapData: AssetMapData;
    bubbleStateConfig?: BubbleStateConfig;
}

export interface AssetAnimalData {
    name: string;
    phaser: {
        map: {
            ages: Record<AnimalAge, AnimalAssetMapData>
        };
    };
    base: {
        ages: Record<AnimalAge, AssetMapData>
    };
}

const PREFIX = "/animals"
export const assetAnimalMap: Record<AnimalId, AssetAnimalData> = {
    [AnimalId.Cow]: {
        name: "Cow",
        phaser: {
            map: {
                ages: {
                    [AnimalAge.Baby]: {
                        mapData: {
                            type: AssetMapType.Spine,
                            spine: {
                                atlas: {
                                    assetKey: "animals-cow-baby-atlas",
                                    assetUrl: getAssetUrl(`${PREFIX}/cow/baby/spine/baby.atlas`),
                                    textureUrl: getAssetUrl(`${PREFIX}/cow/baby/spine/baby.png`),
                                    version: 4,
                                },
                                json: {
                                    assetKey: "animals-cow-baby-json",
                                    assetUrl: `${PREFIX}/cow/baby/spine/baby.json`,
                                    version: 4,
                                },
                                extraOffsets: { x: 0, y: -80 },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -20,
                                y: -35,
                            },
                        },
                    },
                    [AnimalAge.Adult]: {
                        mapData: {
                            type: AssetMapType.Spine,
                            spine: {
                                atlas: {
                                    assetKey: "animals-cow-adult-atlas",
                                    assetUrl: getAssetUrl(`${PREFIX}/cow/adult/spine/adult.atlas`),
                                    textureUrl: getAssetUrl(`${PREFIX}/cow/adult/spine/adult.png`),
                                    version: 3,
                                },
                                json: {
                                    assetKey: "animals-cow-adult-json",
                                    assetUrl: getAssetUrl(`${PREFIX}/cow/adult/spine/adult.json`),
                                    version: 3,
                                },
                                extraOffsets: { x: 0, y: -80 },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: 0,
                                y: -80,
                            },
                        },
                    },
                },
            },
        },
        base: {
            ages: {
                [AnimalAge.Baby]: {
                    type: AssetMapType.Spine,
                    spine: {
                        atlas: {
                            assetKey: "animals-cow-baby-atlas",
                            assetUrl: getAssetUrl(`${PREFIX}/cow/baby/spine/baby.atlas`),
                            textureUrl: getAssetUrl(`${PREFIX}/cow/baby/spine/baby.png`),
                            version: 4,
                        },
                        json: {
                            assetKey: "animals-cow-baby-json",
                            assetUrl: getAssetUrl(`${PREFIX}/cow/baby/spine/baby.json`),
                            version: 4,
                        },
                    },
                    texture: {
                        assetKey: "animals-cow-baby-texture",
                        assetUrl: `${PREFIX}/cow/baby/baby.png`,
                        version: 4,
                    },
                },
                [AnimalAge.Adult]: {
                    type: AssetMapType.Spine,
                    spine: {
                        atlas: {
                            assetKey: "animals-cow-adult-atlas",
                            assetUrl: `${PREFIX}/cow/adult/spine/adult.atlas`,
                            textureUrl: `${PREFIX}/cow/adult/spine/adult.png`,
                            version: 3,
                        },
                        json: {
                            assetKey: "animals-cow-adult-json",
                            assetUrl: `${PREFIX}/cow/adult/spine/adult.json`,
                            version: 3,
                        },
                    },
                    texture: {
                        assetKey: "animals-cow-adult-texture",
                        assetUrl: `${PREFIX}/cow/adult/adult.png`,
                        version: 3,
                    },
                },
            },
        },
    },
    [AnimalId.Chicken]: {
        name: "Chicken",
        phaser: {
            map: {
                ages: {
                    [AnimalAge.Baby]: {
                        mapData: {
                            type: AssetMapType.Spine,
                            spine: {
                                atlas: {
                                    assetKey: "animals-chicken-baby-atlas",
                                    assetUrl: `${PREFIX}/chicken/baby/spine/baby.atlas`,
                                    textureUrl: `${PREFIX}/chicken/baby/spine/baby.png`,
                                    version: 3,
                                },
                                json: {
                                    assetKey: "animals-chicken-baby-json",
                                    assetUrl: `${PREFIX}/chicken/baby/spine/baby.json`,
                                    version: 3,
                                },
                                extraOffsets: { x: 0, y: -80 },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -40,
                                y: -25,
                            },
                        },
                    },
                    [AnimalAge.Adult]: {
                        mapData: {
                            type: AssetMapType.Spine,
                            spine: {
                                atlas: {
                                    assetKey: "animals-chicken-adult-atlas",
                                    assetUrl: `${PREFIX}/chicken/adult/spine/adult.atlas`,
                                    textureUrl: `${PREFIX}/chicken/adult/spine/adult.png`,
                                    version: 3,
                                },
                                json: {
                                    assetKey: "animals-chicken-adult-json",
                                    assetUrl: `${PREFIX}/chicken/adult/spine/adult.json`,
                                    version: 3,
                                },
                                extraOffsets: { x: 0, y: -80 },
                            },
                        },
                        bubbleStateConfig: {
                            extraOffsets: {
                                x: -65,
                                y: -45,
                            },
                        },
                    },
                },
            },
        },
        base: {
            ages: {
                [AnimalAge.Baby]: {
                    type: AssetMapType.Spine,
                    spine: {
                        atlas: {
                            assetKey: "animals-chicken-baby-atlas",
                            assetUrl: `${PREFIX}/chicken/baby/spine/baby.atlas`,
                            textureUrl: `${PREFIX}/chicken/baby/spine/baby.png`,
                            version: 3,
                        },
                        json: {
                            assetKey: "animals-chicken-baby-json",
                            assetUrl: `${PREFIX}/chicken/baby/spine/baby.json`,
                            version: 3,
                        },
                    },
                    texture: {
                        assetKey: "animals-chicken-baby-texture",
                        assetUrl: `${PREFIX}/chicken/baby/baby.png`,
                        version: 3,
                    },
                },
                [AnimalAge.Adult]: {
                    type: AssetMapType.Spine,
                    spine: {
                        atlas: {
                            assetKey: "animals-chicken-adult-atlas",
                            assetUrl: `${PREFIX}/chicken/adult/spine/adult.atlas`,
                            textureUrl: `${PREFIX}/chicken/adult/spine/adult.png`,
                            version: 3,
                        },
                        json: {
                            assetKey: "animals-chicken-adult-json",
                            assetUrl: `${PREFIX}/chicken/adult/spine/adult.json`,
                            version: 3,
                        },
                    },
                    texture: {
                        assetKey: "animals-chicken-adult-texture",
                        assetUrl: `${PREFIX}/chicken/adult/adult.png`,
                        version: 3,
                    },
                },
            },
        },
    },
} 