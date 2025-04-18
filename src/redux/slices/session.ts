import {
    blockchainMap,
    ChainKey,
    CollectionInfo,
    CollectionResponse,
    defaultChainKey,
    defaultNetwork,
    Network,
    TokenInfo,
} from "@/modules/blockchain"
import { Account } from "@/modules/dexie"
import { PlacedItemSchema, InventorySchema, UserSchema } from "@/modules/entities"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SWRResponse } from "swr"

export enum PlayerContext {
    Home = "home",
    Neighbor = "neighbor",
    Moving = "moving",
    Selling = "selling",
    PlacingNFT = "placingNFT",
    Buying = "buying",
}

export interface Accounts {
  accounts: Array<Account>;
  currentId: number;
}

export interface SessionState {
  network: Network;
  mnemonic: string;
  accounts: Accounts;
  chainKey: ChainKey;
  tokens: Tokens;
  nftCollections: NFTCollections;
  retries: number;
  loaded: boolean;
  authenticated: boolean;
  balanceSwrs: Record<string, SWRResponse<number>>;
  nftCollectionSwrs: Record<string, SWRResponse<CollectionResponse>>;
  // selected collection key
  collectionKey: string;
  // selected nft address
  nftAddress: string;
  // selected token key
  tokenKey: string;
  // placed item id
  placedItem?: PlacedItemSchema;
  inventories: Array<InventorySchema>;
  placedItems: Array<PlacedItemSchema>;
  selectedInventoryId?: string;
  selectedDeliveryInventoryId?: string;
  selectedRetrieveInventoryId?: string;
  user?: UserSchema;
  fromToolIndex?: number;
  selectedToolId?: string;
  playerContext: PlayerContext;
  showGameUI: boolean;
}

export type WithEnabled<T> = T & { enabled: boolean };
export type Tokens = Record<string, WithEnabled<TokenInfo>>;
export type ImportedTokens = Record<string, WithEnabled<TokenInfo>>;
export type NFTCollections = Record<string, WithEnabled<CollectionInfo>>;

const initialState: SessionState = {
    network: defaultNetwork,
    mnemonic: "",
    accounts: {
        accounts: [],
        currentId: 0,
    },
    chainKey: defaultChainKey,
    tokens: Object.entries(
        blockchainMap[defaultChainKey].defaultTokens[defaultNetwork]
    ).reduce((tokens, [id, token]) => {
        tokens[id] = { ...token, enabled: true }
        return tokens
    }, {} as Tokens),
    nftCollections: Object.entries(
        blockchainMap[defaultChainKey].defaultCollections[defaultNetwork]
    ).reduce((collections, [id, collection]) => {
        collections[id] = { ...collection, enabled: true }
        return collections
    }, {} as NFTCollections),
    retries: 0,
    loaded: false,
    authenticated: false,
    balanceSwrs: {},
    nftCollectionSwrs: {},
    collectionKey: "",
    nftAddress: "",
    tokenKey: "",
    inventories: [],
    placedItems: [],
    playerContext: PlayerContext.Home,
    showGameUI: false,
}

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setNetwork: (state, action: PayloadAction<Network>) => {
            state.network = action.payload
        },
        setMnemonic: (state, action: PayloadAction<string>) => {
            state.mnemonic = action.payload
        },
        setAccounts: (state, action: PayloadAction<Accounts>) => {
            state.accounts = action.payload
        },
        setChainKey: (state, action: PayloadAction<ChainKey>) => {
            state.chainKey = action.payload
        },
        importTokens: (state, action: PayloadAction<ImportedTokens>) => {
            state.tokens = { ...state.tokens, ...action.payload }
        },
        switchToken: (state, action: PayloadAction<SwitchTokenParams>) => {
            const { id, enabled } = action.payload
            const token = state.tokens[id]
            if (!token) throw new Error("Token not found")
            token.enabled = enabled
        },
        setTokenKey: (state, action: PayloadAction<string>) => {
            state.tokenKey = action.payload
        },
        setRetries: (state, action: PayloadAction<number>) => {
            state.retries = action.payload
        },
        setLoaded: (state, action: PayloadAction<boolean>) => {
            state.loaded = action.payload
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.authenticated = action.payload
        },
        setBalanceSwr: (state, action: PayloadAction<SetBalanceSwrParams>) => {
            const { tokenKey, swr } = action.payload
            state.balanceSwrs[tokenKey] = swr
        },
        removeBalanceSwr: (state, action: PayloadAction<string>) => {
            delete state.balanceSwrs[action.payload]
        },
        setNftCollectionsSwr: (
            state,
            action: PayloadAction<SetNftCollectionsSwrParams>
        ) => {
            const { collectionKey, swr } = action.payload
            state.nftCollectionSwrs[collectionKey] = swr
        },
        removeNftCollectionsSwr: (state, action: PayloadAction<string>) => {
            delete state.nftCollectionSwrs[action.payload]
        },
        setCollectionKey: (state, action: PayloadAction<string>) => {
            state.collectionKey = action.payload
        },
        setNftAddress: (state, action: PayloadAction<string>) => {
            state.nftAddress = action.payload
        },
        setPlacedItem: (state, action: PayloadAction<PlacedItemSchema>) => {
            state.placedItem = action.payload
        },
        setInventories: (state, action: PayloadAction<InventorySchema[]>) => {
            state.inventories = action.payload
        },
        setSelectedInventoryId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedInventoryId = action.payload
        },
        setSelectedDeliveryInventoryId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedDeliveryInventoryId = action.payload
        },
        setSelectedRetrieveInventoryId: (state, action: PayloadAction<string | undefined>) => {
            state.selectedRetrieveInventoryId = action.payload
        },
        setUser: (state, action: PayloadAction<UserSchema>) => {
            state.user = action.payload
        },
        setFromToolIndex: (state, action: PayloadAction<number>) => {
            state.fromToolIndex = action.payload
        },
        setSelectedToolId: (state, action: PayloadAction<string>) => {
            state.selectedToolId = action.payload
        },
        setPlayerContext: (state, action: PayloadAction<PlayerContext>) => {
            state.playerContext = action.payload
        },
        setPlacedItems: (state, action: PayloadAction<Array<PlacedItemSchema>>) => {
            state.placedItems = action.payload
        },
        setShowGameUI: (state, action: PayloadAction<boolean>) => {
            state.showGameUI = action.payload
        }
    },
})

export const sessionReducer = sessionSlice.reducer
export const {
    setNetwork,
    setMnemonic,
    setAccounts,
    setChainKey,
    switchToken,
    importTokens,
    setRetries,
    setTokenKey,
    setLoaded,
    setAuthenticated,
    setBalanceSwr,
    removeBalanceSwr,
    setNftCollectionsSwr,
    removeNftCollectionsSwr,
    setCollectionKey,
    setNftAddress,
    setPlacedItem,
    setInventories,
    setSelectedInventoryId,
    setSelectedDeliveryInventoryId,
    setSelectedRetrieveInventoryId,
    setUser,
    setFromToolIndex,
    setSelectedToolId,
    setPlayerContext,
    setPlacedItems,
    setShowGameUI,
} = sessionSlice.actions

export interface SwitchTokenParams {
  id: string;
  enabled: boolean;
}

export interface SetBalanceSwrParams {
  tokenKey: string;
  swr: SWRResponse<number>;
}

export interface SetNftCollectionsSwrParams {
  collectionKey: string;
  swr: SWRResponse<CollectionResponse>;
}
