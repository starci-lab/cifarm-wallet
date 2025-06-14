"use client"
import {
    INFO_DISCLOSURE,
} from "@/app/(core)/constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components"
import React, { FC } from "react"
import { useDisclosure } from "react-use-disclosure"
import { useAppSelector } from "@/redux"
import { GRAPHQL_QUERY_STATIC_SWR } from "@/app/(core)/constants"
import { useGraphQLQueryStaticSwr } from "@/hooks"
import { getAssetDataRaw } from "@/game/tilemap"
import { PlacedItemType } from "@/modules/entities"
import { FruitContent } from "./FruitContent"
import { TileContent } from "./TileContent"
import { AnimalContent } from "./AnimalContent"
import { BuildingContent } from "./BuildingContent"
import { getPlacedItemTypeName } from "./utils"
import { PetContent } from "./PetContent"

export const InfoModal: FC = () => {
    const { isOpen, toggle } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(INFO_DISCLOSURE)

    const selectedPlacedItemId = useAppSelector(
        (state) => state.sessionReducer.selectedPlacedItemId
    )
    const placedItems = useAppSelector(
        (state) => state.sessionReducer.placedItems
    )
    const placedItem = placedItems.find(
        (placedItem) => placedItem.id === selectedPlacedItemId
    )
    const { swr } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        GRAPHQL_QUERY_STATIC_SWR
    )
    if (!placedItem) {
        return null
    }
    const placedItemType = swr.data?.data.placedItemTypes.find(
        (placedItemType) => placedItemType.id === placedItem?.placedItemType
    )
    if (!placedItemType) {
        return null
    }
    if (!placedItem) {
        return null
    }
    if (!swr.data) {
        return null
    }
    const mapAssetData = getAssetDataRaw({
        placedItemType,
        queryStaticResponsePartial: swr.data?.data,
        isAdult: placedItem.animalInfo?.isAdult,
        fruitStage: placedItem.fruitInfo?.currentStage,
    })
    if (!mapAssetData) {
        return null
    }
    const renderContent = () => {
        switch (placedItemType.type) {
        case PlacedItemType.Fruit: {
            return <FruitContent placedItem={placedItem} />
        }
        case PlacedItemType.Tile: {
            return <TileContent placedItem={placedItem} />
        }
        case PlacedItemType.Animal: {
            return <AnimalContent placedItem={placedItem} />
        }
        case PlacedItemType.Building: {
            return <BuildingContent placedItem={placedItem} />
        }
        case PlacedItemType.Pet: {
            return <PetContent placedItem={placedItem} />
        }
        case PlacedItemType.Terrain: {
            return <></>
        }
        default: {
            throw new Error("Invalid placed item type")
        }
        }
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={toggle}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {getPlacedItemTypeName(placedItemType.id, swr.data?.data) ?? ""}
                    </DialogTitle>
                </DialogHeader>
                {renderContent()}
            </DialogContent>
        </Dialog>
    )
}
