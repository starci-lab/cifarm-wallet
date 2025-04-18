import React, { FC, useEffect, useState } from "react"
import { AnimalCurrentState, PlacedItemSchema } from "@/modules/entities"
import { formatTime } from "@/modules/common"
import { useSingletonHook } from "@/modules/singleton-hook"
import { GRAPHQL_QUERY_STATIC_SWR } from "@/app/constants"
import { useGraphQLQueryStaticSwr } from "@/hooks"
import { DialogFooter, Spacer, Image, ExtendedButton, ExtendedBadge } from "@/components"
import useSWR from "swr"
import { sessionDb } from "@/modules/dexie"
import { cn } from "@/lib/utils"
import { Stats } from "../Stats"
import { assetStateMap, assetProductMap } from "@/modules/assets"

interface AnimalContentProps {
  placedItem: PlacedItemSchema;
}
export const AnimalContent: FC<AnimalContentProps> = ({ placedItem }) => {
    const { swr } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        GRAPHQL_QUERY_STATIC_SWR
    )

    const placedItemType = swr.data?.data.placedItemTypes.find(
        (placedItemType) => placedItemType.id === placedItem?.placedItemType
    )
    if (!placedItemType) {
        throw new Error("Placed item type not found")
    }
    const animal = swr.data?.data.animals.find(
        (animal) => animal.id === placedItemType.animal
    )

    if (!animal) {
        throw new Error("Animal not found")
    }
    if (!placedItem.animalInfo) {
        throw new Error("Placed item animal info not found")
    }
    const animalInfo = swr.data?.data.animalInfo
    if (!animalInfo) {
        throw new Error("Animal info not found")
    }
    const _timeElapsed = placedItem.animalInfo.isAdult
        ? animal.yieldTime - (placedItem.animalInfo.currentYieldTime ?? 0)
        : animal.growthTime - (placedItem.animalInfo.currentGrowthTime ?? 0)

    
    const [timeElapsed, setTimeElapsed] = useState(_timeElapsed)

    useEffect(() => {
        if (
            placedItem.animalInfo?.currentState === AnimalCurrentState.Hungry ||
      placedItem.animalInfo?.currentState === AnimalCurrentState.Sick
        ) {
            return
        }
        const interval = setInterval(() => {
            setTimeElapsed(timeElapsed - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeElapsed])

    const product = swr.data?.data.products.find(
        (product) => product.animal === animal.id
    )
    if (!product) {
        throw new Error("Product not found")
    }

    const { data: asset } = useSWR(placedItem.id, async () => {
        let key: string | undefined
        switch (placedItem.animalInfo?.currentState) {
        case AnimalCurrentState.Hungry:
            key =
          assetStateMap.animal[AnimalCurrentState.Hungry]?.phaser.base.assetKey
            break
        case AnimalCurrentState.Sick:
            key =
            assetStateMap.animal[AnimalCurrentState.Sick]?.phaser.base.assetKey
            break
        case AnimalCurrentState.Yield:
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
        switch (placedItem.animalInfo?.currentState) {
        case AnimalCurrentState.Hungry:
            return (
                <div className="border p-2 rounded-md flex items-center gap-4">
                    <Image
                        src={asset?.data ? URL.createObjectURL(asset.data) : ""}
                        className="w-16 h-16 object-contain"
                    />
                    <div className="text-sm text-muted-foreground">
              The animal is hungry. Purchase animal feed from the shop and feed it to the animal to resume its growth.
                    </div>
                </div>
            )
        case AnimalCurrentState.Sick:
            return (
                <div className="border p-2 rounded-md flex items-center gap-4">
                    <Image
                        src={asset?.data ? URL.createObjectURL(asset.data) : ""}
                        className="w-16 h-16 object-contain"
                    />
                    <div className="text-sm text-muted-foreground">
                    The animal is sick. Consider purchasing animal medicine from the shop and using it on your animal to get rid of the sickness.
                    </div>
                </div>
            )
        case AnimalCurrentState.Yield:
            return (
                <div className="border p-2 rounded-md flex items-center gap-4">
                    <Image
                        src={asset?.data ? URL.createObjectURL(asset.data) : ""}
                        className="w-16 h-16 object-contain"
                    />
                    <div className="flex flex-col">
                        <div className="text-sm text-muted-foreground">
                            The animal is ready to harvest. Use the crate to harvest.
                        </div>
                        <div className="flex items-center">
                            <div className="text-lg font-bold">
                                {`${placedItem.animalInfo.harvestQuantityRemaining}/20`}
                            </div>
                        </div>
                    </div>
                </div>
            )
        case AnimalCurrentState.Normal:
            throw new Error("Animal is not ready to harvest")
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
                    placedItem.animalInfo?.currentState !==
          AnimalCurrentState.Yield && (
                        <>
                            <div>
                                <div className="flex gap-1 items-center">
                                    <div className={cn("text-4xl font-bold", {
                                        "text-destructive": placedItem.animalInfo?.currentState === AnimalCurrentState.Hungry,
                                    })}>
                                        {`${formatTime(timeElapsed)}`}
                                    </div>
                                </div>
                            </div>
                            <Spacer y={4}/>
                        </>
                    )}
                {
                    placedItem.animalInfo?.currentState !== AnimalCurrentState.Normal && (
                        <>
                            {renderState()}
                            <Spacer y={4}/>
                        </>
                    )
                }
                <Stats
                    growthAcceleration={placedItem.animalInfo?.growthAcceleration}
                    qualityYield={placedItem.animalInfo?.qualityYield}
                    diseaseResistance={placedItem.animalInfo?.diseaseResistance}
                    harvestYieldBonus={placedItem.animalInfo?.harvestYieldBonus}
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
