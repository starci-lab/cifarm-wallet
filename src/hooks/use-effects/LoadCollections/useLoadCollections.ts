import { useGraphQLQueryBlockchainCollectionSwr } from "../../swr"
import { useEffect } from "react"
import { setNFTCollectionsSwr, useAppDispatch } from "@/redux"
import { NFTCollectionKey } from "@/modules/entities"

export const useLoadCollections = (collectionKey: NFTCollectionKey) => {
    const dispatch = useAppDispatch()
    // fetch the nft collection swr
    const { swr: nftCollectionSwr } = useGraphQLQueryBlockchainCollectionSwr(collectionKey)
    
    useEffect(() => {
        if (!collectionKey) return
        dispatch(setNFTCollectionsSwr({
            collectionKey,
            swr: nftCollectionSwr,
        }))
    }, [nftCollectionSwr, collectionKey])
}