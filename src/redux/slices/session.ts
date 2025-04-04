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
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SWRResponse } from "swr"

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
  nftCollectionsSwrs: Record<string, SWRResponse<CollectionResponse>>;
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
    nftCollectionsSwrs: {},
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
            state.nftCollectionsSwrs[collectionKey] = swr
        },
        removeNftCollectionsSwr: (state, action: PayloadAction<string>) => {
            delete state.nftCollectionsSwrs[action.payload]
        },
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
    setLoaded,
    setAuthenticated,
    setBalanceSwr,
    removeBalanceSwr,
    setNftCollectionsSwr,
    removeNftCollectionsSwr,
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
