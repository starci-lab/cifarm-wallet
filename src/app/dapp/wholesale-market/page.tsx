"use client"

import React, { FC } from "react"
import { Container, Header, ItemCard, GridTable } from "@/components"
import { useSingletonHook } from "@/modules/singleton-hook"
import { GRAPHQL_MUTATION_CREATE_SHIP_SOLANA_TRANSACTION_SWR_MUTATION, GRAPHQL_MUTATION_SEND_SHIP_SOLANA_TRANSACTION_SWR_MUTATION, GRAPHQL_QUERY_VAULT_CURRENT_SWR, QUERY_STATIC_SWR_MUTATION, SIGN_TRANSACTION_DISCLOSURE } from "@/app/constants"
import { useGraphQLQueryStaticSwr, useGraphQLMutationCreateShipSolanaTransactionSwrMutation, useGraphQLMutationSendShipSolanaTransactionSwrMutation, useGraphQLQueryVaultCurrentSwr } from "@/hooks"
import { assetProductMap } from "@/modules/assets"
import {
    ExtendedButton,
    PaymentIcon,
    Spacer,
    Title,
} from "@/components/styled"
import { PaymentKind } from "@/modules/entities"
import { useAppDispatch, setSignTransactionModal, TransactionType } from "@/redux"
import { useDisclosure } from "react-use-disclosure"
const Page: FC = () => {
    const { swr } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        QUERY_STATIC_SWR_MUTATION
    )
    const { swr: staticSwr } = useSingletonHook<
    ReturnType<typeof useGraphQLQueryStaticSwr>
  >(QUERY_STATIC_SWR_MUTATION)

    const { swr: vaultCurrentSwr } = useSingletonHook<ReturnType<typeof useGraphQLQueryVaultCurrentSwr>>(GRAPHQL_QUERY_VAULT_CURRENT_SWR)
    
    const { swrMutation: createShipSolanaTransactionSwrMutation } = useSingletonHook<ReturnType<typeof useGraphQLMutationCreateShipSolanaTransactionSwrMutation>>(GRAPHQL_MUTATION_CREATE_SHIP_SOLANA_TRANSACTION_SWR_MUTATION)
    const { swrMutation: sendShipSolanaTransactionSwrMutation } = useSingletonHook<ReturnType<typeof useGraphQLMutationSendShipSolanaTransactionSwrMutation>>(GRAPHQL_MUTATION_SEND_SHIP_SOLANA_TRANSACTION_SWR_MUTATION)
    
    const dispatch = useAppDispatch()
    const { open } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SIGN_TRANSACTION_DISCLOSURE
    )
    return (
        <Container hasPadding>
            <div className="h-full justify-between flex flex-col">
                <div>
                    <div>
                        <Header
                            title="Wholesale Market"
                        />
                    </div>
                    <Spacer y={6} />
                    <div>
                        <Title
                            title="Requirements"
                            tooltipString="Requirements for the wholesale market"
                        />
                        <Spacer y={4} />
                        <div>
                            <GridTable
                                enableScroll={false}
                                items={swr.data?.data.wholesaleMarket.products || []}
                                contentCallback={({ quantity, productId }) => {
                                    const product = staticSwr.data?.data.products.find(
                                        (product) => product.id === productId
                                    )
                                    if (!product) throw new Error("Product not found")
                                    return (
                                        <ItemCard
                                            name={assetProductMap[product?.displayId].name}
                                            imageUrl={
                                                assetProductMap[product?.displayId].base.assetUrl
                                            }
                                            showTooltip={true}
                                            description={
                                                assetProductMap[product?.displayId].description
                                            }
                                            quantity={quantity}
                                            isQuality={product.isQuality}
                                            stackable={true}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <Spacer y={6} />
                        <div>
                            <Title
                                title="Payment"
                                tooltipString="Payment for the wholesale market"
                            />
                            <Spacer y={4} />
                            <div className="flex items-center gap-2">
                                <PaymentIcon
                                    paymentKind={
                                        staticSwr.data?.data.wholesaleMarket.paymentKind ||
                    PaymentKind.Token
                                    }
                                    className="w-8 h-8"
                                />
                                <div className="text-2xl">
                                    {vaultCurrentSwr.data?.data.vaultCurrent.paidAmount}
                                </div>
                            </div>
                            <Spacer y={2} />
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <div className="text-xs">
                                Token locked: {vaultCurrentSwr.data?.data.vaultCurrent.tokenLocked}  
                                </div>
                                <div className="text-xs">
                            Paid count: {vaultCurrentSwr.data?.data.vaultCurrent.paidCount}
                                </div>
                            </div>
                        </div>
                        <Spacer y={6} />
                    </div>
                </div>
                <ExtendedButton className="w-full" onClick={async () => {
                    const { data } = await createShipSolanaTransactionSwrMutation.trigger({})
                    if (!data) throw new Error("Failed to create ship solana transaction")
                    dispatch(setSignTransactionModal({
                        type: TransactionType.SolanaRawTx,
                        data: {
                            serializedTx: data.serializedTx
                        },
                        postActionHook: async (signedSerializedTx) => {
                            const { data: sendShipSolanaTransactionData } = await sendShipSolanaTransactionSwrMutation.trigger({
                                request: {
                                    serializedTx: signedSerializedTx
                                }
                            })
                            if (!sendShipSolanaTransactionData) throw new Error("Failed to send ship solana transaction")
                            return sendShipSolanaTransactionData.txHash
                        }
                    }))
                    open()
                }}>
          Ship
                </ExtendedButton>
            </div>
        </Container>
    )
}

export default Page
