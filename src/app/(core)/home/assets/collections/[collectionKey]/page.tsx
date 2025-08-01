"use client"
import { ExtendedBadge, ExtendedButton, FilterBar, Header, Spacer } from "@/components"
import React, { useEffect } from "react"
import { useAppSelector, useAppDispatch, setIsConverting, setNFTAddresses, setNFTCollectionKey } from "@/redux"
import { useParams } from "next/navigation"
import { pathConstants } from "@/constants"
import { useIsMobile, useRouterWithSearchParams } from "@/hooks"
import { useSingletonHook } from "@/singleton"
import { CONVERT_NFT_MODAL_DISCLOSURE } from "@/singleton"
import { NFTCollectionKey } from "@/types"
import { envConfig } from "@/env"
import { NFTCard } from "./NFTCard"
import { NFTCardSkeleton } from "./NFTCardSkeleton"
import { ArrowsClockwise, Swap } from "@phosphor-icons/react"
import { cn } from "@/utils"
import { useDisclosure } from "react-use-disclosure"

const Page = () => {
    const params = useParams()
    const collectionKey = params.collectionKey as NFTCollectionKey
    const network = envConfig().network

    const router = useRouterWithSearchParams()

    const isConverting = useAppSelector((state) => state.convertReducer.isConverting)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!collectionKey) {
            router.push(pathConstants.home)
        }
    }, [collectionKey])  

    const staticData = useAppSelector((state) => state.apiReducer.coreApi.static)

    const collection = staticData?.nftCollections[collectionKey]?.[network]
    const nftAddresses = useAppSelector((state) => state.convertReducer.nftAddresses)
    const isMobile = useIsMobile()
    const conversionRate = staticData?.nftConversion.conversionRate || 1
    const isConvertDisabled = nftAddresses.length === 0 || nftAddresses.length % conversionRate !== 0
    const { open: openConvertNFTModal } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        CONVERT_NFT_MODAL_DISCLOSURE
    )
    const nftCollectionSwrs = useAppSelector((state) => state.swrsReducer.nftCollectionSwrs)
    const nftCollectionSwr = nftCollectionSwrs[collectionKey]


    // reset the nft addresses and is converting when unmount
    useEffect(() => {
        return () => {
            dispatch(setNFTAddresses([]))
            dispatch(setIsConverting(false))
        }
    }, [])

    return (
        <div>
            <div className="flex justify-between items-center gap-4">
                <Header showBackButton={true} isSkeleton={!staticData} title={`${collection?.name}`}/>
            </div>
            <Spacer y={6} />
            <div className="flex justify-between items-center gap-4">
                <div className="flex gap-2 items-center">
                    {isConverting && (
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2 items-center">
                                <ExtendedButton color="secondary" variant="flat" onClick={() => dispatch(setIsConverting(false))}>
                                Cancel
                                </ExtendedButton>
                                <ExtendedButton color="primary" disabled={isConvertDisabled} onClick={() => {
                                    openConvertNFTModal()
                                }}>
                                Done
                                </ExtendedButton>
                            </div>
                            <div className={cn({
                                "text-destructive": isConvertDisabled
                            })}>
                                {`${nftAddresses.length}/${conversionRate} NFTs selected`}
                            </div>
                        </div>
                    )
                    }
                    {
                        !isConverting && (
                            <ExtendedButton color="secondary" variant="flat" onClick={() => {
                                dispatch(setNFTAddresses([]))
                                dispatch(setNFTCollectionKey(collectionKey))
                                dispatch(setIsConverting(true))
                            }}>
                                <Swap />
                            Convert
                            </ExtendedButton>
                        )}
                </div>
                <div className="flex gap-2 items-center">
                    <FilterBar
                        onSearchStringChange={() => {}}
                        searchString={""}
                        className="max-w-[200px]"
                    />
                    <ExtendedButton color="secondary" size="icon" variant="flat" onClick={() => {
                        nftCollectionSwr.mutate()
                    }}>
                        <ArrowsClockwise />
                    </ExtendedButton>
                </div>
            </div>  
            {nftCollectionSwr?.data?.cached && nftCollectionSwr?.data?.refreshInterval > 0 && (
                <>
                    <Spacer y={4} />
                    <div className="text-muted-foreground text-sm flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <ExtendedBadge>
                            Cached
                            </ExtendedBadge>
                            <div>
                                Wait {nftCollectionSwr?.data?.refreshInterval} seconds to refresh
                            </div>
                        </div>
                    </div>
                </>
            )}
            <Spacer y={4} />
            {   
                (!nftCollectionSwr?.data) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {
                            isMobile ? (
                                <NFTCardSkeleton />
                            ) : (
                                <>
                                    <NFTCardSkeleton />
                                    <NFTCardSkeleton />
                                    <NFTCardSkeleton />
                                    <NFTCardSkeleton />
                                </>
                            )
                        }
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {nftCollectionSwr.data?.collection.nfts.map((nft) => {
                            if (!nftCollectionSwr.data) throw new Error("No data")
                            return (
                                <NFTCard key={nft.nftAddress} nft={nft} />
                            )
                        })}
                    </div>
                )
            }
        </div>
    )
}

export default Page
