import { Title, Spacer } from "@/components"
import { useAppSelector } from "@/redux"
import React, { FC } from "react"
import { NFTCollection } from "./NFTCollection"
export const NFTCollections: FC = () => {
    const collections = useAppSelector(
        (state) => state.sessionReducer.nftCollections
    )
    return (
        <div>
            <Title
                title="NFT Collections"
                tooltipString="The NFT collections you have added to your wallet."
            />
            <Spacer y={4} />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {Object.keys(collections).map((collection) => {
                    return <NFTCollection key={collection} collectionKey={collection} />
                })}
            </div>
        </div>
    )
}
