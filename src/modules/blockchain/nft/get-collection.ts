import { ChainKey, Network } from "../common"
import { solanaHttpRpcUrl } from "../rpcs"
import { Platform, chainKeyToPlatform } from "../common"
import { defaultNetwork } from "../default"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { Attribute, mplCore } from "@metaplex-foundation/mpl-core"
import { NFTCollections, NFTCollectionKey } from "@/types"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { das } from "@metaplex-foundation/mpl-core-das"

import axios from "axios"
import { publicKey } from "@metaplex-foundation/umi"
export interface GetCollectionParams {
  chainKey: ChainKey;
  //use collection address
  collectionAddress?: string;
  collectionKey?: NFTCollectionKey;
  network?: Network;
  accountAddress: string;
  //collection list for the chainKey, if collectionKey is set but collections not set, it will throw an error
  collections?: NFTCollections;
  skip?: number;
  limit?: number;
}

export interface NFTTrait {
    key: string
    value: string
}
export interface NFTData {
    name: string;
    nftAddress: string;
    attributes: Array<Attribute>
    wrapped: boolean
    image: string
    description: string
}

export interface CollectionResponse {
    nfts: Array<NFTData>;
}

export const getSolanaCollection = async ({
    collectionAddress,
    network,
    collectionKey,
    accountAddress,
    collections,
    chainKey,
    skip = 0,
    limit = 10,
}: GetCollectionParams): Promise<CollectionResponse> => {
    network = network || defaultNetwork
    if (collectionKey) {
        if (!collections) throw new Error("Cannot find collection without collections")
        const collection = collections[collectionKey]
        if (!collection) throw new Error("Cannot find collection without collections")
        collectionAddress = collection?.[network]?.collectionAddress
    }
    if (!collectionAddress) throw new Error("Cannot find collection without collection address")
    const umi = createUmi(solanaHttpRpcUrl({chainKey, network}))
        .use(mplCore()).use(dasApi())
    let assets = await das.searchAssets(umi, {
        grouping: ["collection", collectionAddress],
        owner: publicKey(accountAddress),   
        limit,
        page: Math.floor(skip / limit) + 1,
    })
    assets = assets.filter((asset) => asset.owner.toString() === accountAddress)
    const nfts: Array<NFTData> = []
    const promises: Array<Promise<void>> = []
    for (const asset of assets) {
        promises.push((async () => {
            const uniqueParam = `timestamp=${new Date().getTime()}`
            const { data } = await axios.get<MetaplexNFTMetadata>(`${asset.uri}?${uniqueParam}`)
            nfts.push({
                name: asset.name,
                nftAddress: asset.publicKey.toString(),
                attributes: asset.attributes?.attributeList ?? [],
                wrapped: asset.permanentFreezeDelegate?.frozen ?? false,
                image: data.image,
                description: data.description,
            })
        })())
    }
    await Promise.all(promises)
    // with filters
    return {
        nfts
    }
}

export const getCollection = (params: GetCollectionParams) => {
    const platform = chainKeyToPlatform(params.chainKey)
    switch (platform) {
    case Platform.Solana:
        return getSolanaCollection(params)
    case Platform.Sui:
        throw new Error("Sui is not supported")
    default:
        throw new Error("Invalid platform")
    }
}

export interface MetaplexNFTMetadata {
    name: string
    description: string
    image: string
}
