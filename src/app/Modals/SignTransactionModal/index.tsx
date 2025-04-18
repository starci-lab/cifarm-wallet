"use client"
import {
    GRAPHQL_QUERY_STATIC_SWR,
    HONEYCOMB_SEND_TRANSACTION_SWR_MUTATION,
    HONEYCOMB_SEND_TRANSACTIONS_SWR_MUTATION,
    SEND_UMI_SERIALIZED_TX_SWR_MUTATION,
    SIGN_TRANSACTION_DISCLOSURE,
    TRANSFER_NFT_SWR_MUTATION,
    TRANSFER_TOKEN_SWR_MUTATION,
} from "@/app/constants"
import { truncateString } from "@/modules/common"
import { useSingletonHook } from "@/modules/singleton-hook"
import { Image, List, Snippet, Spacer } from "@/components"
import {
    FreezeSolanaMetaplexNFTData,
    HoneycombProtocolRawTxData,
    HoneycombProtocolRawTxsData,
    PurchaseSolanaNFTStarterBoxData,
    TransactionType,
    TransferNFTData,
    TransferTokenData,
    useAppSelector,
} from "@/redux"
import React, { FC } from "react"
import { blockchainMap, explorerUrl } from "@/modules/blockchain"
import {
    useGraphQLQueryStaticSwr,
    useHoneycombSendTransactionsSwrMutation,
    useHoneycombSendTransactionSwrMutation,
    useSendUmiSerializedTxSwrMutation,
    useTransferNFTSwrMutation,
    useTransferTokenSwrMutation,
} from "@/hooks"
import useSWRMutation from "swr/mutation"
import { ExtendedButton, ModalHeader } from "@/components"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks"
import { useDisclosure } from "react-use-disclosure"
import { getNFTImage } from "@/app/utils"

interface ProviderInfo {
  name: string;
}

export const SignTransactionModal: FC = () => {
    const { isOpen, toggle } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SIGN_TRANSACTION_DISCLOSURE
    )

    const { swrMutation: honeycombSendTransactionSwrMutation } = useSingletonHook<
    ReturnType<typeof useHoneycombSendTransactionSwrMutation>
  >(HONEYCOMB_SEND_TRANSACTION_SWR_MUTATION)

    const { swrMutation: honeycombSendTransactionsSwrMutation } =
    useSingletonHook<
      ReturnType<typeof useHoneycombSendTransactionsSwrMutation>
    >(HONEYCOMB_SEND_TRANSACTIONS_SWR_MUTATION)

    const { swrMutation: transferTokenSwrMutation } = useSingletonHook<
    ReturnType<typeof useTransferTokenSwrMutation>
  >(TRANSFER_TOKEN_SWR_MUTATION)

    
    const { swrMutation: sendUmiSerializedTxSwrMutation } = useSingletonHook<
    ReturnType<typeof useSendUmiSerializedTxSwrMutation>
  >(SEND_UMI_SERIALIZED_TX_SWR_MUTATION)        

    const { swrMutation: transferNFTSwrMutation } = useSingletonHook<
    ReturnType<typeof useTransferNFTSwrMutation>
  >(TRANSFER_NFT_SWR_MUTATION)

    const { swr: swrStatic } = useSingletonHook<ReturnType<typeof useGraphQLQueryStaticSwr>>(
        GRAPHQL_QUERY_STATIC_SWR
    )

    const type = useAppSelector(
        (state) => state.modalReducer.signTransactionModal.type
    )
    const data = useAppSelector(
        (state) => state.modalReducer.signTransactionModal.data
    )
    const extraAction = useAppSelector(
        (state) => state.modalReducer.signTransactionModal.extraAction
    )

    const network = useAppSelector((state) => state.sessionReducer.network)

    const { toast } = useToast()

    const accounts = useAppSelector(
        (state) => state.sessionReducer.accounts.accounts
    )
    const currentAccountId = useAppSelector(
        (state) => state.sessionReducer.accounts.currentId
    )
    const account = accounts.find((account) => account.id === currentAccountId)

    const addTxHashToast = (txHash: string) =>
        toast({
            title: "Tx hash",
            description: truncateString(txHash, 10, 4),
            action: (
                <ExtendedButton
                    variant="outline"
                    onClick={() => {
                        window.open(
                            explorerUrl({
                                chainKey,
                                network,
                                value: txHash,
                                type: "tx",
                            }),
                            "_blank"
                        )
                    }}
                >
          View
                </ExtendedButton>
            ),
            variant: "default",
        })

    const addErrorToast = (errorMessage: string = "Failed to sign transaction") =>
        toast({
            title: "Error",
            description: truncateString(errorMessage, 400, 0),
            variant: "destructive",
        })

    const balanceSwrs = useAppSelector(
        (state) => state.sessionReducer.balanceSwrs
    )
    const collections = useAppSelector(
        (state) => state.sessionReducer.nftCollections
    )
    

    const { trigger, isMutating } = useSWRMutation(
        "SIGN_TRANSACTION",
        async () => {
            try {
                let txHash = ""
                switch (type) {
                case TransactionType.HoneycombProtocolRawTx: {
                    //return await honeycombSendTransactionSwrMutation.trigger(data)
                    // get the edge client
                    const { txResponse } = data as HoneycombProtocolRawTxData
                    const response = await honeycombSendTransactionSwrMutation.trigger({
                        transaction: txResponse,
                    })
                    if (!response) throw new Error("Failed to send transaction")
                    if (response.error) {
                        throw new Error(response.error)
                    }
                    txHash = response.signature?.toString() ?? ""
                    break
                }
                case TransactionType.HoneycombProtocolRawTxs: {
                    const { txResponses } = data as HoneycombProtocolRawTxsData
                    const responses =
              await honeycombSendTransactionsSwrMutation.trigger({
                  transactions: txResponses,
              })
                    if (!responses) throw new Error("Failed to send transaction")
                    // last transaction bundle response
                    const lastResponse = responses.at(-1)?.responses[0]
                    if (!lastResponse) throw new Error("Failed to send transaction")
                    if (lastResponse.error) {
                        throw new Error(lastResponse.error)
                    }
                    txHash = lastResponse.signature ?? ""
                    break
                }
                case TransactionType.TransferToken: {
                    const { tokenKey, amount, recipientAddress } =
              data as TransferTokenData
                    const { txHash: txHashResponse } =
              await transferTokenSwrMutation.trigger({
                  amount,
                  tokenKey,
                  recipientAddress,
              })
                    txHash = txHashResponse

                    await balanceSwrs[tokenKey].mutate()

                    break
                }
                case TransactionType.TransferNFT: {
                    const { nft, recipientAddress, collectionKey } =
              data as TransferNFTData
                    const { txHash: txHashResponse } =
              await transferNFTSwrMutation.trigger({
                  nftAddress: nft.nftAddress,
                  recipientAddress,
                  collectionKey,
              })
                    txHash = txHashResponse
                    break
                }
                case TransactionType.PurchaseSolanaNFTStarterBox: {
                    const { serializedTx } = data as PurchaseSolanaNFTStarterBoxData
                    // decode the serializedTx
                    const { txHash: txHashResponse } = await sendUmiSerializedTxSwrMutation.trigger({
                        serializedTx,
                    })
                    txHash = txHashResponse
                    break
                }
                case TransactionType.FreezeSolanaMetaplexNFT: {
                    const { serializedTx } = data as FreezeSolanaMetaplexNFTData
                    // decode the serializedTx
                    const { txHash: txHashResponse } = await sendUmiSerializedTxSwrMutation.trigger({
                        serializedTx,
                    })
                    txHash = txHashResponse
                    break
                }
                default: {
                    throw new Error("Invalid transaction type")
                }
                }
                if (extraAction) {
                    await extraAction()
                }
                addTxHashToast(txHash)
            } catch (error) {
                addErrorToast((error as Error).message)
            } finally {
                toggle(false)
            }
        }
    )
    const chainKey = useAppSelector((state) => state.sessionReducer.chainKey)
    const tokens = useAppSelector((state) => state.sessionReducer.tokens)
    if (!account) return null

    const providers: Record<TransactionType, ProviderInfo> = {
        [TransactionType.TransferToken]: {
            name: "Transfer Token",
        },
        [TransactionType.HoneycombProtocolRawTx]: {
            name: "Honeycomb Protocol Raw Tx",
        },
        [TransactionType.TransferNFT]: {
            name: "Transfer NFT",
        },
        [TransactionType.HoneycombProtocolRawTxs]: {
            name: "Honeycomb Protocol Raw Txs",
        },
        [TransactionType.FreezeSolanaMetaplexNFT]: {
            name: "Freeze Solana Metaplex NFT",
        },
        [TransactionType.PurchaseSolanaNFTStarterBox]: {
            name: "Purchase Solana NFT Starter Box",
        },
    }

    const renderContent = () => {
        switch (type) {
        case TransactionType.TransferToken: {
            const { tokenKey, amount, recipientAddress } =
          data as TransferTokenData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(TransferTokenContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case TransferTokenContent.Token: {
                            return (
                                <div className="flex items-center justify-between px-2 py-3">
                                    <div className="text-sm font-semibold">Token</div>
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={tokens[tokenKey].imageUrl}
                                            className="rounded-none w-5 h-5"
                                        />
                                        <div className="text-sm">{tokens[tokenKey].name}</div>
                                    </div>
                                </div>
                            )
                        }
                        case TransferTokenContent.Amount: {
                            return (
                                <div className="flex items-center justify-between px-2 py-3">
                                    <div className="text-sm font-semibold">Amount</div>
                                    <div className="flex gap-2 items-center">
                                        <div className="text-sm">{amount}</div>
                                    </div>
                                </div>
                            )
                        }
                        case TransferTokenContent.RecipientAddress: {
                            return (
                                <div className="flex items-center justify-between px-2 py-1">
                                    <div className="text-sm font-semibold">
                        Recipient Address
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="text-sm">
                                            {truncateString(recipientAddress, 10, 4)}
                                        </div>
                                        <Snippet code={recipientAddress} />
                                    </div>
                                </div>
                            )
                        }
                        }
                    }}
                />
            )
        }
        case TransactionType.HoneycombProtocolRawTx: {
            const { txResponse } = data as HoneycombProtocolRawTxData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(HoneycombProtocolRawTxContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case HoneycombProtocolRawTxContent.SerializedTx: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">Serialized Tx</div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center text-sm break-all whitespace-pre-wrap line-clamp-5">
                                            {truncateString(txResponse.transaction, 30, 4)}
                                        </div>
                                        <Snippet code={txResponse.transaction} />
                                    </div>
                                </div>
                            )
                        }
                        }
                    }}
                />
            )
        }
        case TransactionType.HoneycombProtocolRawTxs: {
            const { txResponses } = data as HoneycombProtocolRawTxsData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(HoneycombProtocolRawTxsContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case HoneycombProtocolRawTxsContent.SerializedTx: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">
                        Serialized Txs
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center text-sm break-all whitespace-pre-wrap line-clamp-5">
                                            {txResponses.transactions.map((transaction) => {
                                                return (
                                                    <div
                                                        className="flex gap-2 items-center"
                                                        key={transaction}
                                                    >
                                                        <div>{truncateString(transaction, 30, 4)}</div>
                                                        <Snippet code={transaction} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        }
                    }}
                />
            )
        }
        case TransactionType.FreezeSolanaMetaplexNFT: {
            const { serializedTx } = data as FreezeSolanaMetaplexNFTData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(FreezeSolanaMetaplexNFTContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case FreezeSolanaMetaplexNFTContent.SerializedTx: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">Serialized Tx</div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center text-sm break-all whitespace-pre-wrap line-clamp-5">
                                            {truncateString(serializedTx, 30, 4)}
                                        </div>
                                        <Snippet code={serializedTx} />
                                    </div>
                                </div>
                            )
                        }
                        }
                    }}
                />
            )
        }
        case TransactionType.TransferNFT: {
            const { nft, recipientAddress, collectionKey } =
          data as TransferNFTData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(TransferNFTContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case TransferNFTContent.Collection: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">Collection</div>
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={collections[collectionKey].imageUrl}
                                            className="rounded-none w-5 h-5 object-contain"
                                        />
                                        <div className="text-sm">
                                            {collections[collectionKey].name}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        case TransferNFTContent.NFT: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">NFT</div>
                                    <div className="flex gap-2 items-center">
                                        <Image
                                            src={(() => {
                                                if (!swrStatic.data?.data) return ""
                                                const imageUrl = getNFTImage({
                                                    collectionKey,
                                                    nft,
                                                    collections,
                                                    staticData: swrStatic.data.data,
                                                })
                                                return imageUrl
                                            })()}
                                            className="rounded-none w-5 h-5 object-contain"
                                        />
                                        <div className="text-sm">{nft.name}</div>
                                    </div>
                                </div>
                            )
                        }
                        case TransferNFTContent.RecipientAddress: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-1">
                                    <div className="text-sm font-semibold">
                        Recipient Address
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div className="text-sm">
                                            {truncateString(recipientAddress, 10, 4)}
                                        </div>
                                        <Snippet code={recipientAddress} />
                                    </div>
                                </div>
                            )
                        }
                        }           
                    }}
                />
            )
        }
        case TransactionType.PurchaseSolanaNFTStarterBox: {
            const { serializedTx } = data as PurchaseSolanaNFTStarterBoxData
            return (
                <List
                    enableScroll={false}
                    items={Object.values(PurchaseSolanaNFTStarterBoxContent)}
                    contentCallback={(item) => {
                        switch (item) {
                        case PurchaseSolanaNFTStarterBoxContent.SerializedTx: {
                            return (
                                <div className="flex items-center justify-between gap-12 px-2 py-3">
                                    <div className="text-sm font-semibold">Serialized Tx</div>
                                    <div className="flex gap-2 items-center">
                                        <div className="flex gap-2 items-center text-sm break-all whitespace-pre-wrap line-clamp-5">
                                            {truncateString(serializedTx, 30, 4)}
                                        </div>
                                        <Snippet code={serializedTx} />
                                    </div>
                                </div>
                            )
                        }
                        }
                    }}
                />
            )
        }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader title="Sign Transaction" />
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className="flex gap-2 items-center">
                        <Badge variant="secondary" className="flex gap-1">
                            <Image
                                src={blockchainMap[chainKey].imageUrl}
                                className="rounded-none w-4 h-4"
                            />
                            {blockchainMap[chainKey].name}
                        </Badge>
                        <Badge variant="secondary">{providers[type].name}</Badge>
                    </div>
                    <Spacer y={4} />
                    {renderContent()}
                </div>
                <DialogFooter className="w-full">
                    <ExtendedButton
                        variant="ghost"
                        onClick={() => toggle(false)}
                        className="text-muted-foreground w-full"
                    >
            Cancel
                    </ExtendedButton>
                    <ExtendedButton
                        className="w-full"
                        isLoading={isMutating}
                        onClick={() => trigger()}
                    >
            Sign
                    </ExtendedButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export enum TransferTokenContent {
  Token = "token",
  Amount = "amount",
  RecipientAddress = "recipientAddress",
}

export enum TransferNFTContent {
  Collection = "collection",
  NFT = "nft",
  RecipientAddress = "recipientAddress",
}

export enum HoneycombProtocolRawTxContent {
  SerializedTx = "serializedTx",
}

export enum HoneycombProtocolRawTxsContent {
  SerializedTx = "serializedTxs",
}

export enum FreezeSolanaMetaplexNFTContent {
  SerializedTx = "serializedTx",
}

export enum PurchaseSolanaNFTStarterBoxContent {
  SerializedTx = "serializedTx",
}


