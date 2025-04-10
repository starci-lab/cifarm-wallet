import { AnimalId } from "@/modules/entities"
import { AssetData, AssetMapData, AssetMapType } from "./types"

export enum AnimalAge {
    Baby = "baby",
    Adult = "adult",
}

export interface AssetAnimalData {
    name: string;
    phaser: {
        map: {
            ages: Record<AnimalAge, AssetMapData>
        };
    };
    base: {
        ages: Record<AnimalAge, AssetData>
    };
}

export const assetAnimalMap: Record<AnimalId, AssetAnimalData> = {
    [AnimalId.Cow]: {
        name: "Cow",
        phaser: {
            map: {
                ages: {
                    [AnimalAge.Baby]: {
                        type: AssetMapType.Spine,
                        spine: {
                            atlas: {
                                key: "animals-cow-baby-atlas",
                                assetUrl: "animals/cow/baby/spine/baby.atlas",
                                textureUrl: "animals/cow/baby/spine/baby.png",
                            },
                            json: {
                                key: "animals-cow-baby-json",
                                assetUrl: "animals/cow/baby/spine/baby.json",
                            },
                            extraOffsets: { x: 0, y: -80 },
                        },
                    },
                    [AnimalAge.Adult]: {
                        type: AssetMapType.Spine,
                        spine: {
                            atlas: {
                                key: "animals-cow-adult-atlas",
                                assetUrl: "animals/cow/adult/spine/adult.atlas",
                                textureUrl: "animals/cow/adult/spine/adult.png",
                            },
                            json: {
                                key: "animals-cow-adult-json",
                                assetUrl: "animals/cow/adult/spine/adult.json",
                            },
                            extraOffsets: { x: 0, y: -80 },
                        },
                    },
                },
            },
        },
        base: {
            ages: {
                [AnimalAge.Baby]: {
                    assetKey: "animals-cow-baby",
                    assetUrl: "animals/cow/baby/spine/baby.png",
                },
                [AnimalAge.Adult]: {
                    assetKey: "animals-cow-adult",
                    assetUrl: "animals/cow/adult/spine/adult.png",
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
                        type: AssetMapType.Spine,
                        spine: {
                            atlas: {
                                key: "animals-chicken-baby-atlas",
                                assetUrl: "animals/chicken/baby/spine/baby.atlas",
                                textureUrl: "animals/chicken/baby/spine/baby.png",
                            },
                            json: {
                                key: "animals-chicken-baby-json",
                                assetUrl: "animals/chicken/baby/spine/baby.json",
                            },
                            extraOffsets: { x: 0, y: -80 },
                        },
                    },
                    [AnimalAge.Adult]: {
                        type: AssetMapType.Spine,
                        spine: {
                            atlas: {
                                key: "animals-chicken-adult-atlas",
                                assetUrl: "animals/chicken/adult/spine/adult.atlas",
                                textureUrl: "animals/chicken/adult/spine/adult.png",
                            },
                            json: {
                                key: "animals-chicken-adult-json",
                                assetUrl: "animals/chicken/adult/spine/adult.json",
                            },
                            extraOffsets: { x: 0, y: -80 },
                        },
                    },
                },
            },
        },
        base: {
            ages: {
                [AnimalAge.Baby]: {
                    assetKey: "animals-chicken-baby",
                    assetUrl: "animals/chicken/baby/spine/baby.png",
                },
                [AnimalAge.Adult]: {
                    assetKey: "animals-chicken-adult",
                    assetUrl: "animals/chicken/adult/spine/adult.png",
                },
            },
        },
    },
} 