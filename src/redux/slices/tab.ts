import { createSlice } from "@reduxjs/toolkit"

export enum AssetTab {
    OnChain = "on-chain",
    InGame = "in-game",
}

export enum TransferTab {
    Token = "token",
    NFT = "nft",
}

export enum NeighborsTab {
    Neighbors = "neighbors",
    Followees = "followees",
}

export enum QuestsTab {
    Game = "game",
    Daily = "daily",
    Social = "social",
    Partnership = "partnership",
}

export interface TabSlice {
    assetTab: AssetTab
    transferTab: TransferTab
    neighborsTab: NeighborsTab
    questsTab: QuestsTab
}

const initialState: TabSlice = {
    assetTab: AssetTab.OnChain,
    transferTab: TransferTab.Token,
    neighborsTab: NeighborsTab.Neighbors,
    questsTab: QuestsTab.Social,
}

export const tabSlice = createSlice({
    name: "tab",
    initialState,
    reducers: {
        setAssetTab: (state, action) => {
            state.assetTab = action.payload
        },
        setTransferTab: (state, action) => {
            state.transferTab = action.payload
        },
        setNeighborsTab: (state, action) => {
            state.neighborsTab = action.payload
        },
        setQuestsTab: (state, action) => {
            state.questsTab = action.payload
        },
    },
})

export const tabReducer = tabSlice.reducer
export const { setAssetTab, setTransferTab, setNeighborsTab, setQuestsTab } = tabSlice.actions
