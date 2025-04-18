"use client"

import {
    Container,
    Header,
    Image,
    PressableCard,
    NFTRarityBadge,
    Spacer,
    WrappedBadge,
    NFTValidatedBadge,
} from "@/components"
import { pathConstants } from "@/constants"
import { useGraphQLQueryStaticSwr, useRouterWithSearchParams } from "@/hooks"
import { AttributeName, NFTRarityEnum } from "@/modules/blockchain"
import { setNftAddress, useAppDispatch, useAppSelector } from "@/redux"
import React, { FC } from "react"
import { QUERY_STATIC_SWR_MUTATION } from "../constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import { getNFTImage } from "../utils"

const Page: FC = () => {
    const collectionKey = useAppSelector(
        (state) => state.sessionReducer.collectionKey
    )
    const collectionSwrs = useAppSelector(
        (state) => state.sessionReducer.nftCollectionSwrs
    )
    const collectionSwr = collectionSwrs[collectionKey]
    const collections = useAppSelector(
        (state) => state.sessionReducer.nftCollections
    )
    const collection = collections[collectionKey]
    const router = useRouterWithSearchParams()
    const dispatch = useAppDispatch()
    const { swr: staticSwr } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        QUERY_STATIC_SWR_MUTATION
    )
    if (!staticSwr.data) {
        return null
    }
    return (
        <Container hasPadding>
            <div className="h-full">
                <Header title={collection.name} />
                <Spacer y={6} />
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {collectionSwr.data?.nfts.map((nft) => {
                        if (!staticSwr.data) {
                            return null
                        }
                        const image = getNFTImage({
                            collectionKey,
                            nft,
                            collections,
                            staticData: staticSwr.data.data,
                        })
                        return (
                            <PressableCard key={nft.nftAddress} className="relative" onClick={
                                () => {
                                    dispatch(setNftAddress(nft.nftAddress))
                                    router.push(pathConstants.nft)
                                }
                            }>
                                <div className="grid place-items-center p-3 w-full">
                                    <Image
                                        src={image}
                                        className="w-40 h-40 object-contain"
                                    />
                                    <div className="top-3 left-3 absolute">
                                        <NFTRarityBadge
                                            rarity={
                                                nft.attributes.find(
                                                    (rarity) => rarity.key === AttributeName.Rarity
                                                )?.value as NFTRarityEnum
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-2 absolute left-3 bottom-3 bg-background/50 text-muted-background rounded-md px-2 py-1.5">
                                        <div>
                                            <div className="text-sm font-bold">{nft.name}</div>
                                            <Spacer y={1}/>
                                            <div className="flex gap-2 items-center flex-wrap">
                                                {
                                                    nft.wrapped && (
                                                        <WrappedBadge />
                                                    )
                                                }
                                                {
                                                    nft.validated && (
                                                        <NFTValidatedBadge />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    
                                    </div>
                                </div>
                            </PressableCard>
                        )
                    })}
                </div>
            </div>
        </Container>
    )
}

export default Page
