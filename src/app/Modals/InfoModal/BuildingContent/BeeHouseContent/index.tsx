import { GRAPHQL_QUERY_STATIC_SWR } from "@/app/constants"
import { useGraphQLQueryStaticSwr } from "@/hooks"
import { BeeHouseCurrentState, BuildingKind, PlacedItemSchema, ProductType } from "@/modules/entities"
import { useSingletonHook } from "@/modules/singleton-hook"
import React, { FC, useEffect, useState } from "react"
import useSWR from "swr"
import { sessionDb } from "@/modules/dexie"
import { cn } from "@/lib/utils"
import { DialogFooter, Spacer, Image, ExtendedButton, ExtendedBadge } from "@/components"
import {
    assetProductMap,
} from "@/modules/assets"
import { formatTime } from "@/modules/common"
import { Stats } from "../../Stats"
interface BeeHouseContentProps {
    placedItem: PlacedItemSchema;
}
export const BeeHouseContent: FC<BeeHouseContentProps> = ({ placedItem }) => {
    const { swr } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        GRAPHQL_QUERY_STATIC_SWR
    )

    const placedItemType = swr.data?.data.placedItemTypes.find(
        (placedItemType) => placedItemType.id === placedItem?.placedItemType
    )
    if (!placedItemType) {
        throw new Error("Placed item type not found")
    }
    const building = swr.data?.data.buildings.find(
        (building) => building.id === placedItemType.building
    )
    if (!building) {
        throw new Error("Building not found")
    }
    if (building.kind !== BuildingKind.BeeHouse) {
        throw new Error("Building is not a bee house")
    }

    if (!placedItem.buildingInfo) {
        throw new Error("Placed item building info not found")
    }

    if (!placedItem.beeHouseInfo) {
        throw new Error("Placed item bee house info not found")
    }

    if (!building.beeHouseYieldTime) {
        throw new Error("Building bee house yield time not found")
    }

    const _timeElapsed = building?.beeHouseYieldTime - (placedItem.beeHouseInfo.currentYieldTime ?? 0)

    const [timeElapsed, setTimeElapsed] = useState(_timeElapsed)

    useEffect(() => {
        if (
            placedItem.beeHouseInfo?.currentState === BeeHouseCurrentState.Yield
        ) {
            return
        }
        const interval = setInterval(() => {
            setTimeElapsed(timeElapsed - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeElapsed])

    const product = swr.data?.data.products.find(
        (product) => 
            product.type === ProductType.BeeHouse &&
            product.building === building.id
    )
    if (!product) {
        throw new Error("Product not found")
    }

    const { data: asset } = useSWR(placedItem.id, async () => {
        let key: string | undefined
        switch (placedItem.beeHouseInfo?.currentState) {
        case BeeHouseCurrentState.Yield:
            key = assetProductMap[product.displayId].base.assetKey
            break
        }
        if (!key) {
            return
        }
        const asset = await sessionDb.assets.get({
            key,
        })
        if (!asset) {
            throw new Error("Asset not found")
        }
        return asset
    })

    const renderState = () => {
        switch (placedItem.beeHouseInfo?.currentState) {
        case BeeHouseCurrentState.Yield:
            return (
                <div className="border p-2 rounded-md flex items-center gap-4">
                    <Image
                        src={asset?.data ? URL.createObjectURL(asset.data) : ""}
                        className="w-16 h-16 object-contain"
                    />
                    <div className="text-sm text-muted-foreground">
                        The bee house is ready to yield. Use the crate to harvest.
                    </div>
                </div>
            )
        case BeeHouseCurrentState.Normal:
            throw new Error("Bee house is not ready to yield")
        }
    }

    return (
        <>
            <div>
                {
                    placedItem.nftMetadata && (
                        <>
                            <div className="flex items-center gap-2">
                                <ExtendedBadge>
                                    NFT
                                </ExtendedBadge>
                                <div className="text-sm text-muted-foreground">
                                    {placedItem.nftMetadata.nftName}
                                </div>
                            </div>
                            <Spacer y={4}/>
                        </>
                    )
                }
                {
                    placedItem.beeHouseInfo?.currentState !==
          BeeHouseCurrentState.Yield && (
                        <>
                            <div>
                                <div className="flex gap-1 items-center">
                                    <div className={cn("text-4xl font-bold")}>
                                        {`${formatTime(timeElapsed)}`}
                                    </div>
                                </div>
                            </div>
                            <Spacer y={4}/>
                        </>
                    )}
                {
                    placedItem.beeHouseInfo?.currentState !== BeeHouseCurrentState.Normal && (
                        <>
                            {renderState()}
                            <Spacer y={4}/>
                        </>
                    )
                }
                <Stats
                    growthAcceleration={placedItem.beeHouseInfo?.growthAcceleration}
                    qualityYield={placedItem.beeHouseInfo?.qualityYield}
                    diseaseResistance={placedItem.beeHouseInfo?.diseaseResistance}
                    harvestYieldBonus={placedItem.beeHouseInfo?.harvestYieldBonus}
                />
                {placedItem.nftMetadata && (
                    <>
                        <Spacer y={4}/>
                        <DialogFooter>
                            {
                                <ExtendedButton className="w-full">
                                        Manage
                                </ExtendedButton>
                            }
                        </DialogFooter>
                    </>
                ) 
                }
            </div>

        </>
    )
}
