// Crop Assets Loading (Fixed with proper configurations for TilesetConfig, TextureConfig, and ExtraOffsets)
import { FruitId } from "@/modules/entities"
import { Scene } from "phaser"
import { ShopAssetData, TextureConfig, TilesetConfig } from "./types"

// Crop Asset Data Interface
export interface FruitStageAssetData {
  textureConfig: TextureConfig;
  tilesetConfig: TilesetConfig; // TilesetConfig optional, can be used for additional offsets and other info
}

export interface FruitAssetData {
  map: Record<number, FruitStageAssetData>;
  name: string;
  shop?: ShopAssetData;
}

// Crop asset data map with the GID and asset URL for each crop using CropId as the key
export const fruitAssetMap: Record<FruitId, FruitAssetData> = {
    [FruitId.Banana]: {
        name: "Banana",
        map: {
            0: {
                textureConfig: { key: "fruit-banana-1", assetUrl: "fruits/banana/1.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: 0,
                        y: -40,
                    },
                },
            },
            1: {
                textureConfig: { key: "fruit-banana-2", assetUrl: "fruits/banana/2.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: 0,
                        y: -48,
                    },
                },
            },
            2: {
                textureConfig: { key: "fruit-banana-3", assetUrl: "fruits/banana/3.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -10,
                        y: -48,
                    },
                },
            },
            3: {
                textureConfig: { key: "fruit-banana-4", assetUrl: "fruits/banana/4.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -10,
                        y: -45,
                    },
                },
            },
            4: {
                textureConfig: { key: "fruit-banana-5", assetUrl: "fruits/banana/5.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -15,
                        y: -35,
                    },
                },
            },
        },
        shop: {
            textureConfig: {
                key: "fruit-banana-sapling",
                assetUrl: "fruits/banana/sapling.png",
                extraOffsets: {
                    y: -10,
                },
            },
        },
    },
    [FruitId.Apple]: {
        name: "Apple",
        map: {
            0: {
                textureConfig: { key: "fruit-apple-1", assetUrl: "fruits/apple/1.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: 0,
                        y: -40,
                    },
                },
            },
            1: {
                textureConfig: { key: "fruit-apple-2", assetUrl: "fruits/apple/2.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: 0,
                        y: -48,
                    },
                },
            },
            2: {
                textureConfig: { key: "fruit-apple-3", assetUrl: "fruits/apple/3.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -10,
                        y: -48,
                    },
                },
            },
            3: {
                textureConfig: { key: "fruit-apple-4", assetUrl: "fruits/apple/4.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -10,
                        y: -45,
                    },
                },
            },
            4: {
                textureConfig: { key: "fruit-apple-5", assetUrl: "fruits/apple/5.png" },
                tilesetConfig: {
                    extraOffsets: {
                        x: -15,
                        y: -35,
                    },
                },
            },
        },
        shop: {
            textureConfig: {
                key: "fruit-apple-sapling",
                assetUrl: "fruits/apple/sapling.png",
            },
        },
    },
}

// Function to load crop assets (images) for each crop and growth stage
export const loadFruitAssets = (scene: Scene) => {
    Object.keys(fruitAssetMap).forEach((fruitId) => {
        const _fruitId = fruitId as FruitId
        const fruitData = fruitAssetMap[_fruitId]

        if (!fruitData) {
            throw new Error(`Fruit asset data not found for fruitId: ${fruitId}`)
        }
        // Load the seed asset
        if (fruitData.shop) {
            scene.load.image(
                fruitData.shop.textureConfig.key,
                fruitData.shop.textureConfig.assetUrl
            )
        }

        // Load the asset for each growth stage
        for (const stage of Object.keys(fruitData.map)) {
            const stageData = fruitData.map[parseInt(stage)]
            const { key, assetUrl, useExisting } = stageData.textureConfig
            if (!useExisting) {
                scene.load.image(key, assetUrl)
            }      
        }
    })
}
