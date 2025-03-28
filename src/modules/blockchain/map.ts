import { envConfig } from "@/env"
import { ChainKey, Network } from "./common"

export enum DefaultToken {
    Native = "native",
    $CARROT = "$CARROT",
    $CAULI = "$CAULI",
}

export const blockchainMap: Record<ChainKey, BlockchainInfo> = {
    [ChainKey.Solana]: {
        imageUrl: "/solana.svg",
        name: "Solana",
        honeycombProtocol: {
            [Network.Testnet]: {
                projectAddress: envConfig().honeycombProjectAddress[Network.Testnet],
            },
            [Network.Mainnet]: {
                projectAddress: envConfig().honeycombProjectAddress[Network.Mainnet],
            }
        },
        defaultTokens: {
            [Network.Mainnet]: {
                [DefaultToken.Native]: {
                    name: "Solana",
                    symbol: "SOL",
                    address: "",
                    decimals: 9,
                    imageUrl: "/solana.svg",
                },
                [DefaultToken.$CARROT]: {
                    name: "$CARROT",
                    symbol: "$CARROT",
                    address: "",
                    decimals: 9,
                    imageUrl: "/$CARROT.png",
                    useHoneycombProtocol: true,
                },
                [DefaultToken.$CAULI]: {
                    name: "$CAULI",
                    symbol: "$CAULI",
                    address: "",
                    decimals: 9,
                    imageUrl: "/$CAULI.png",
                }
            },
            [Network.Testnet]: {
                [DefaultToken.Native]: {
                    name: "Solana",
                    symbol: "SOL",
                    address: "",
                    decimals: 9,
                    imageUrl: "/solana.svg",
                },
                [DefaultToken.$CARROT]: {
                    name: "$CARROT",
                    symbol: "$CARROT",
                    address: envConfig().honeycombTokenAddress[Network.Testnet],
                    decimals: 9,
                    imageUrl: "/$CARROT.png",
                    useHoneycombProtocol: true,
                },
                [DefaultToken.$CAULI]: {
                    name: "$CAULI",
                    symbol: "$CAULI",
                    address: "",
                    decimals: 9,
                    imageUrl: "/$CAULI.png",
                }
            }
        }
    },
    [ChainKey.Sui]: {
        imageUrl: "/sui.svg",
        name: "SUI",
        defaultTokens: {
            [Network.Mainnet]: {
                [DefaultToken.Native]: {
                    name: "SUI",
                    symbol: "SUI",
                    address: "",
                    decimals: 8,
                    imageUrl: "/sui.svg",
                },
                [DefaultToken.$CARROT]: {
                    name: "$CARROT",
                    symbol: "$CARROT",
                    address: "",
                    decimals: 8,
                    imageUrl: "/$CARROT.png",
                },
                [DefaultToken.$CAULI]: {
                    name: "$CAULI",
                    symbol: "$CAULI",
                    address: "",
                    decimals: 8,
                    imageUrl: "/$CAULI.png",
                }
            },
            [Network.Testnet]: {
                [DefaultToken.Native]: {
                    name: "SUI",
                    symbol: "SUI",
                    address: "",
                    decimals: 8,
                    imageUrl: "/sui.svg",
                },
                [DefaultToken.$CARROT]: {
                    name: "$CARROT",
                    symbol: "$CARROT",
                    address: "",
                    decimals: 8,
                    imageUrl: "/$CARROT.png",
                },
                [DefaultToken.$CAULI]: {
                    name: "$CAULI",
                    symbol: "$CAULI",
                    address: "",
                    decimals: 8,
                    imageUrl: "/$CAULI.png",
                }
            }
        }
    }
}

export const networkMap: Record<Network, NetworkInfo> = {
    [Network.Mainnet]: {
        name: "Mainnet",
    },
    [Network.Testnet]: {
        name: "Testnet",
    }
}

export type DefaultTokens = Record<DefaultToken, TokenInfo>

export interface HoneycombProtocol {
    projectAddress: string
}

export interface BlockchainInfo {
    imageUrl: string
    name: string
    defaultTokens: Record<Network, DefaultTokens>
    honeycombProtocol?: Record<Network, HoneycombProtocol>
}

export interface TokenInfo {
    name: string
    symbol: string
    address: string
    decimals: number
    imageUrl: string
    // a boolean value to check if the token is using the honeycomb protocol
    useHoneycombProtocol?: boolean
}

export interface NetworkInfo {
    name: string
}