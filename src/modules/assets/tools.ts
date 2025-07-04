import { AssetData, AssetTextureData, Metadata } from "./types"
import { ToolId } from "@/types"
import { getAssetUrl } from "./utils"

const PREFIX = "/tools"

export interface AssetToolsData extends Metadata {
    base: AssetData
    phaser: {
        base: AssetTextureData
    }
}
export const assetToolsMap: Record<ToolId, AssetToolsData> = {
    [ToolId.AnimalMedicine]: {
        name: "Animal Medicine",
        description: "Medicine for treating sick animals.",
        base: {
            assetKey: "tools-animal-medicine",
            assetUrl: getAssetUrl(`${PREFIX}/animal-medicine.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-animal-medicine",
                assetUrl: getAssetUrl(`${PREFIX}/animal-medicine.png`)
            }
        }
    },
    [ToolId.BugNet]: {
        name: "Bug Net",
        description: "Tool for catching insects.",
        base: {
            assetKey: "tools-bug-net",
            assetUrl: getAssetUrl(`${PREFIX}/bug-net.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-bug-net",
                assetUrl: getAssetUrl(`${PREFIX}/bug-net.png`)
            }
        }
    },
    [ToolId.Hammer]: {
        name: "Hammer",
        description: "Tool for building and repairs.",
        base: {
            assetKey: "tools-hammer",
            assetUrl: getAssetUrl(`${PREFIX}/hammer.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-hammer",
                assetUrl: getAssetUrl(`${PREFIX}/hammer.png`)
            }
        }
    },
    [ToolId.Hand]: {
        name: "Hand",
        description: "Basic tool for interaction.",
        base: {
            assetKey: "tools-hand",
            assetUrl: getAssetUrl(`${PREFIX}/hand.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-hand",
                assetUrl: getAssetUrl(`${PREFIX}/hand.png`)
            }
        }
    },
    [ToolId.Crate]: {
        name: "Crate",
        description: "Container for storing items.",
        base: {
            assetKey: "tools-crate",
            assetUrl: getAssetUrl(`${PREFIX}/crate.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-crate",
                assetUrl: getAssetUrl(`${PREFIX}/crate.png`)
            }
        }
    },
    [ToolId.WateringCan]: {
        name: "Watering Can",
        description: "Tool for watering plants.",
        base: {
            assetKey: "tools-watering-can",
            assetUrl: getAssetUrl(`${PREFIX}/watering-can.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-watering-can",
                assetUrl: getAssetUrl(`${PREFIX}/watering-can.png`)
            }
        }
    },
    [ToolId.Herbicide]: {
        name: "Herbicide",
        description: "Chemical for weed control.",
        base: {
            assetKey: "tools-herbicide",
            assetUrl: getAssetUrl(`${PREFIX}/herbicide.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-herbicide",
                assetUrl: getAssetUrl(`${PREFIX}/herbicide.png`)
            }
        }
    },
    [ToolId.Pesticide]: {
        name: "Pesticide",
        description: "Chemical for pest control.",
        base: {
            assetKey: "tools-pesticide",
            assetUrl: getAssetUrl(`${PREFIX}/pesticide.png`)
        },
        phaser: {
            base: {
                assetKey: "tools-pesticide",
                assetUrl: getAssetUrl(`${PREFIX}/pesticide.png`)
            }
        }
    }     
}

