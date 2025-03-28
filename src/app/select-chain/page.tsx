"use client"
import {
    Container,
    ExclamationTooltip,
    Header,
    Image,
    PressableCard,
    List,
    Spacer,
} from "@/components"
import { cn } from "@/lib/utils"
import { blockchainMap, ChainKey, Network } from "@/modules/blockchain"
import { setChainKey, useAppDispatch, useAppSelector } from "@/redux"
import { CheckIcon } from "lucide-react"
import React, { FC } from "react"
import { NetworkDropdown } from "./NetworkDropdown"
import { Alert, AlertDescription } from "@/components/ui/alert"

const Page: FC = () => {
    const dispatch = useAppDispatch()
    const chainKey = useAppSelector((state) => state.sessionReducer.chainKey)
    const network = useAppSelector((state) => state.sessionReducer.network)
    const isTestnet = network === Network.Testnet
    return (
        <Container hasPadding>
            <div className="h-full">
                <Header
                    title="Select Chain"
                    description="Select the chain you want to use."
                />
                <Spacer y={6} />
                <div>
                    <div className="flex gap-2 items-center">
                        <div className="text-lg font-bold">Supported Chains</div>
                        <ExclamationTooltip message="Select the chain you want to use." />
                    </div>
                    <Spacer y={4} />
                    <List
                        enableScroll={false}
                        items={Object.values(ChainKey)}
                        contentCallback={(item) => {
                            const isSelected = chainKey === item
                            return (
                                <PressableCard
                                    showBorder={false}
                                    key={item}
                                    onClick={() => {
                                        dispatch(setChainKey(item))
                                    }}
                                    className={cn(
                                        "w-full p-3 rounded-none",
                                        isSelected ? "bg-default/40" : ""
                                    )}
                                >
                                    <div className="w-full flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <Image
                                                src={blockchainMap[item].imageUrl}
                                                className="w-6 h-6"
                                            />
                                            <div>{blockchainMap[item].name}</div>
                                        </div>
                                        {isSelected && <CheckIcon className="w-4 h-4" />}
                                    </div>
                                </PressableCard>
                            )
                        }}
                    />
                </div>
                <Spacer y={6} />
                <div>
                    <div className="flex gap-2 items-center">
                        <div className="text-lg font-bold">Network</div>
                        <ExclamationTooltip message="Select the network you want to use." />
                    </div>
                    <Spacer y={6} />
                    <NetworkDropdown />
                    <Spacer y={4} />
                    {isTestnet && (
                        <Alert variant="default">
                            <AlertDescription>
                You are on the testnet network. This means that you are using a
                test version of the blockchain.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </Container>
    )
}

export default Page
