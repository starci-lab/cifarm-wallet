import { ChainKey, chainKeyToPlatform, Network, Platform } from "../common"
import { computeRaw } from "@/modules/common"
import { TransferResult } from "../types"
import { Tokens, TokenKey } from "@/types"
import {
    publicKey,
    transactionBuilder,
    sol,
    createNoopSigner,
} from "@metaplex-foundation/umi"
import {
    createTokenIfMissing,
    findAssociatedTokenPda,
    getSplAssociatedTokenProgramId,
    transferSol,
} from "@metaplex-foundation/mpl-toolbox"
import { transferTokens } from "@metaplex-foundation/mpl-toolbox"
import base58 from "bs58"
import { Umi } from "@metaplex-foundation/umi"

export interface TransferParams {
  chainKey: ChainKey;
  tokenKey?: TokenKey;
  network?: Network;
  recipientAddress: string;
  amount: number;
  fromAddress?: string;
  tokens?: Tokens;

  // adapters
  // solana
    umi?: Umi;
}

export const _transferSolana = async ({
    network,
    recipientAddress,
    amount,
    fromAddress,
    tokenKey,
    umi,
    tokens,
    chainKey,
}: TransferParams): Promise<TransferResult> => {
    if (!tokenKey) throw new Error("Missing tokenKey")
    network = network || Network.Testnet
    if (!umi) throw new Error("Missing umi")

    if (!fromAddress) throw new Error("Missing fromAddress")
    if (!recipientAddress) throw new Error("Missing recipientAddress")

    const from = publicKey(fromAddress)
    const to = publicKey(recipientAddress)

    if (tokenKey === TokenKey.Native) {
    // Native SOL transfer
        const tx = transactionBuilder().add(
            transferSol(umi, {
                source: createNoopSigner(from),
                destination: to,
                amount: sol(amount),
            })
        )

        const txSignature = await tx.sendAndConfirm(umi)
        return { txHash: base58.encode(txSignature.signature) }
    }

    const token = tokens?.[tokenKey]?.[chainKey]?.[network]
    if (!token) throw new Error("Missing token")
    const { tokenAddress, decimals } = token
    if (!tokenAddress) throw new Error("Missing token address")

    const mint = publicKey(tokenAddress)

    const sourceTokenTransaction = createTokenIfMissing(umi, {
        mint,
        ataProgram: getSplAssociatedTokenProgramId(umi),
        owner: from,
    })

    const destinationTokenTransaction = createTokenIfMissing(umi, {
        mint,
        ataProgram: getSplAssociatedTokenProgramId(umi),
        owner: to,
    })

    const tx = transactionBuilder()
        .add(sourceTokenTransaction)
        .add(destinationTokenTransaction)
        .add(
            transferTokens(umi, {
                source: findAssociatedTokenPda(umi, {
                    mint,
                    owner: publicKey(fromAddress),
                }),
                destination: findAssociatedTokenPda(umi, {
                    mint,
                    owner: publicKey(recipientAddress),
                }),
                authority: createNoopSigner(publicKey(fromAddress)),
                amount: computeRaw(amount, decimals),
            })
        )

    const txSignature = await tx.sendAndConfirm(umi)
    return { txHash: base58.encode(txSignature.signature) }
}

// export const _transferSui = async ({
//     network,
//     recipientAddress,
//     amount,
//     tokens,
//     tokenKey,
//     chainKey,
//     currentWallet,
// }: TransferParams): Promise<TransferResult> => {
//     if (!currentWallet) throw new Error("Missing currentWallet")
//     network = network || defaultNetwork
//     if (!tokens) throw new Error("Cannot find balance without tokens")
//     if (!tokenKey) throw new Error("Cannot find balance without tokenKey")
//     const token = tokens[tokenKey]?.[chainKey]?.[network]
//     if (!token) throw new Error("Cannot find balance without token")
//     const tx = new SuiTransaction()
//     const tokenAddress =
//     tokenKey === TokenKey.Native ? tx.gas : token.tokenAddress
//     if (!tokenAddress) throw new Error("Missing token address")
//     //case native
//     const decimals = token.decimals
//     if (!decimals) throw new Error("Missing decimals")
//     const [coin] = tx.splitCoins(tokenAddress, [computeRaw(amount, decimals)])
//     tx.transferObjects([coin], recipientAddress)

//     const output = await currentWallet.features[
//         "sui:signAndExecuteTransaction"
//     ]?.signAndExecuteTransaction({
//         transaction: tx,
//         account: currentWallet.accounts[0],
//         chain: currentWallet.chains[0],
//     })
//     if (!output) throw new Error("Missing output")
//     return { txHash: output.digest }
// }

export const transferToken = async (
    params: TransferParams
): Promise<TransferResult> => {
    const platform = chainKeyToPlatform(params.chainKey)
    switch (platform) {
    case Platform.Solana:
        return _transferSolana(params)
    // case Platform.Sui:
    //     return _transferSui(params)
    default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
}
