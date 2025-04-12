import { AssetData } from "./types"

export enum AssetUIId {
    Frame = "frame",
    SelectedArrow = "selected-arrow",
    Locked = "locked",
    Checked = "checked",
}

const PREFIX = "ui"

export interface AssetUIData {
    base: AssetData
}
export const assetUiMap: Record<AssetUIId, AssetUIData> = {
    [AssetUIId.Frame]: {
        base: {
            assetKey: "ui-frame",
            assetUrl: `${PREFIX}/frame.png`
        },
    },
    [AssetUIId.Locked]: {
        base: {
            assetKey: "ui-locked",
            assetUrl: `${PREFIX}/locked.png`
        },
    },
    [AssetUIId.SelectedArrow]: {
        base: {
            assetKey: "ui-selected-arrow",
            assetUrl: `${PREFIX}/selected-arrow.png`
        },
    },
    [AssetUIId.Checked]: {
        base: {
            assetKey: "ui-checked",
            assetUrl: `${PREFIX}/checked.png`
        },
    },
}