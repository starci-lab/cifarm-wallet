// we use range of GID from 12001 - 13000 to represent different types of buildings
import { BuildingId } from "@/modules/entities"
import { Scene } from "phaser"
import { TextureConfig, TilesetConfig } from "./types"

export interface BuildingAssetData {
  name: string;
  // config for tileset
  tilesetConfig: TilesetConfig;
  // texture config
  textureConfig: TextureConfig
}

// Crop asset data map with the GID and asset URL for each crop using CropId as the key
export const buildingAssetMap: Record<BuildingId, BuildingAssetData> = {
    [BuildingId.Home]: {
        name: "Home",
        tilesetConfig: {
            gid: 12001,
            tilesetName: "buildings-home",
            // scaleTextureHeight: 3,
            // scaleTextureWidth: 3,
            // extraOffsets: { x: -70, y: -120 },
            tileSizeHeight: 2,
            tileSizeWidth: 2,
        },
        textureConfig: {
            key: "buildings-home",
            assetUrl: "buildings/home.png",
        }
    },
    [BuildingId.Coop]: {
        name: "Coop",
        tilesetConfig: {
            gid: 12002,
            tilesetName: "coop",
            // scaleTextureHeight: 3,
            // scaleTextureWidth: 3,
            // extraOffsets: { x: -70, y: -120 },
            tileSizeHeight: 2,
            tileSizeWidth: 2,
        },
        textureConfig: {
            key: "coop",
            assetUrl: "buildings/coop.png",
        }
    },
    [BuildingId.Barn]: {
        name: "Barn",
        tilesetConfig: {
            gid: 12003,
            tilesetName: "barn",
            // scaleTextureHeight: 3,
            // scaleTextureWidth: 3,
            // extraOffsets: { x: -70, y: -120 },
            tileSizeHeight: 2,
            tileSizeWidth: 2,
        },
        textureConfig: {
            key: "barn",
            assetUrl: "buildings/barn.png",
        }
    },
}

// function to load animals assets (images) for each animal
export const loadBuildingAssets = (scene: Scene) => {
    // Iterate over each animalId in the animalAssetDataMap
    Object.keys(buildingAssetMap).forEach((buildingId) => {
        const _buildingId = buildingId as BuildingId
        const buildingData = buildingAssetMap[_buildingId]

        if (!buildingData) {
            throw new Error(`Building data not found for buildingId: ${buildingId}`)
        }

        // Load the asset for the building
        const { key, assetUrl} = buildingData.textureConfig
        scene.load.image(
            key,
            assetUrl
        )
    })
}