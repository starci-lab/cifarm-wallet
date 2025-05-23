"use client"

import { SHEET_NFT_DISCLOSURE } from "@/app/constants"
import { Image, WrappedBadge, Spacer, NFTRarityBadge, Separator, Card, CardBody } from "@/components"
import { AttributeName, NFTData, NFTRarityEnum } from "@/modules/blockchain"
import { useSingletonHook } from "@/modules/singleton-hook"
import React, { FC } from "react"
import { useDisclosure } from "react-use-disclosure"
import { setNFTSheet, useAppDispatch } from "@/redux"

interface NFTCardProps {
    nft: NFTData
}

export const NFTCard: FC<NFTCardProps> = ({ nft }) => {
    const { open: openNFTSheet } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SHEET_NFT_DISCLOSURE
    )

    const dispatch = useAppDispatch()
    return (
        <Card pressable className="flex-1 p-0 overflow-hidden relative" onClick={
            () => {
                dispatch(setNFTSheet({
                    nftAddress: nft.nftAddress,
                })) 
                openNFTSheet()
            }
        }>
            <CardBody className="pb-2">
                <div className="flex flex-col gap-2 absolute top-3 right-3">
                    <NFTRarityBadge
                        rarity={
                            nft.attributes.find(
                                (rarity) => rarity.key === AttributeName.Rarity
                            )?.value as NFTRarityEnum
                        }   
                    />
                    {
                        nft.wrapped && (
                            <WrappedBadge />
                        )
                    }
                </div>
                <Spacer y={2}/>
                <Image   
                    src={nft.image}
                    className="w-24 h-24 object-contain"
                />
                <Spacer y={2}/>
                <div className="text-lg">{nft.name}</div>
            </CardBody>
            <Separator/>
            <CardBody className="pt-2">
                <div className="text-muted-foreground">
                    {nft.description ?? "No description"}
                </div>
            </CardBody>
        </Card>   
    )
}
