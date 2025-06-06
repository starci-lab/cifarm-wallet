import useSWRMutation from "swr/mutation"
import { UseSWRMutation } from "../../types"
import { sendTransaction } from "@honeycomb-protocol/edge-client/client/helpers"
import { edgeClient, TxResponse } from "@/modules/honeycomb"
import { useAppSelector } from "@/redux"
import { ChainKey } from "@/modules/blockchain"
import base58 from "bs58"
import { Keypair } from "@solana/web3.js"
import { TransactionResponse } from "@honeycomb-protocol/edge-client"
export interface SendTransactionParams {
    transaction: TxResponse
}

export const useHoneycombSendTransactionSwrMutation = (): UseSWRMutation<
  TransactionResponse | null,
  SendTransactionParams
> => {
    const { accounts, activateAccountId } = useAppSelector((state) => state.sessionReducer.accounts)
    const account = accounts.find((account) => account.id === activateAccountId)
    const chainKey = useAppSelector((state) => state.sessionReducer.chainKey) 
    const network = useAppSelector((state) => state.sessionReducer.network)
    const swrMutation = useSWRMutation(
        JSON.stringify({ chainKey, account }),
        async (
            _: string,
            extraArgs: { arg: SendTransactionParams }
        ) => {
            if (!account) return null
            if (chainKey !== ChainKey.Solana) return null
            const keypair = Keypair.fromSecretKey(base58.decode(account.privateKey))
            const { transaction } = { ...extraArgs.arg }
            console.log(keypair.publicKey.toBase58())
            //claim the daily reward
            return await sendTransaction(edgeClient(network), transaction, [keypair])
        }
    )

    //return the state and the data
    return {
        swrMutation,
    }
}
