import {
    Image,
    IconSelection,
    List,
    ExtendedButton,
    DialogBody,
    DialogFooter,
} from "@/components"
import React, { FC, useState } from "react"
import { useConnectWallet, useWallets, useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit"
import { useAppDispatch } from "@/redux"
import { setChainKey } from "@/redux"
import { ChainKey } from "@/modules/blockchain"
export const SuiConnect: FC = () => {
    const { mutate: connect } = useConnectWallet()
    const wallets = useWallets()
    const { isConnecting, isConnected, currentWallet } = useCurrentWallet()
    const { mutate: disconnect } = useDisconnectWallet()
    const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const suiWallets = [
        {
            icon: <Image src="https://framerusercontent.com/images/eDZRos3xvCrlWxmLFr72sFtiyQ.png?scale-down-to=512" alt="Suiet" className="w-10 h-10" />,
            wallet: "Suiet",
            name: "Suiet",
            onClick: async () => {
                setConnectingWallet("Suiet")
                const suietWallet = wallets.find((wallet) => wallet.name === "Suiet")
                if (!suietWallet) {
                    throw new Error("Suiet wallet not found")
                }
                connect({
                    wallet: suietWallet,
                })
                dispatch(setChainKey(ChainKey.Sui))
            },
        },
        {
            icon: <Image src="/phantom.svg" alt="Phantom" className="w-10 h-10" />,
            name: "Phantom",
            wallet: "Phantom",
            onClick: async () => {
                setConnectingWallet("Phantom")
                const phantomWallet = wallets.find((wallet) => wallet.name === "Phantom")
                if (!phantomWallet) {
                    throw new Error("Phantom wallet not found")
                }
                connect({
                    wallet: phantomWallet,
                })
                dispatch(setChainKey(ChainKey.Sui))
            },
        },
        {
            icon: <Image src="/nightly.svg" alt="Nighty" className="w-10 h-10" />,
            name: "Nightly",
            wallet: "Nightly",
            onClick: async () => {
                setConnectingWallet("Nightly")
                const nightyWallet = wallets.find((wallet) => wallet.name === "Nightly")
                if (!nightyWallet) {
                    throw new Error("Nightly wallet not found")
                }
                connect({
                    wallet: nightyWallet,
                })
                dispatch(setChainKey(ChainKey.Sui))
            },
        },
    ]

    return (
        <>
            <DialogBody>
                <List
                    classNames={{
                        container: "gap-2",
                    }}
                    enableScroll={false}
                    items={suiWallets}
                    contentCallback={(item) => (
                        (() => {
                            return (
                                <IconSelection
                                    key={item.wallet}
                                    disabled={isConnected}
                                    icon={item.icon}
                                    text={item.name}
                                    classNames={{
                                        description: "text-secondary",
                                    }}
                                    onClick={item.onClick}
                                    isLoading={isConnecting && connectingWallet === item.wallet}
                                    description={
                                        isConnected && currentWallet?.name === item.wallet
                                            ? "Connected"
                                            : undefined
                                    }
                                />
                            )
                        })()
                    )}
                    showSeparator={false}
                />
            </DialogBody>
            <DialogFooter>
                <ExtendedButton
                    disabled={!isConnected}
                    className="w-full"
                    color="destructive"
                    onClick={() => {
                        disconnect()
                    }}
                >
          Disconnect
                </ExtendedButton>
            </DialogFooter >
        </>
    )
}
