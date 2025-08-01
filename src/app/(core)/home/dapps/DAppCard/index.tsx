import {
    Image,
    Spacer,
    Spinner,
    Card,
    CardBody,
    CardFooter,
} from "@/components"
import React, { FC } from "react"
import { ChainKey, chainKeyMap } from "@/modules/blockchain"
import { useCurrentWallet } from "@mysten/dapp-kit"
import { useSingletonHook } from "@/singleton"
import { WALLET_CONNECTION_REQUIRED_MODAL_DISCLOSURE } from "@/singleton"
import { useDisclosure } from "react-use-disclosure"
import { useAppDispatch, setWalletConnectionRequiredModalContent } from "@/redux"
import { useGlobalAccountAddress } from "@/hooks"
interface DAppCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
  content?: React.ReactNode;
  isLoading?: boolean;
  chainKey?: ChainKey;
  requireConnectWallet?: boolean;
}

export const DAppCard: FC<DAppCardProps> = ({
    title,
    description,
    imageUrl,
    onClick,
    content,
    isLoading,
    chainKey = ChainKey.Solana,
    requireConnectWallet = true,
}) => {
    const { accountAddress } = useGlobalAccountAddress()
    const { currentWallet } = useCurrentWallet()
    const { open: openWalletConnectionRequiredModal } = useSingletonHook<
    ReturnType<typeof useDisclosure>
  >(WALLET_CONNECTION_REQUIRED_MODAL_DISCLOSURE)
    const dispatch = useAppDispatch()
    return (
        <Card
            onClick={() => {
                if (
                    requireConnectWallet &&
          chainKey === ChainKey.Solana &&
          !accountAddress
                ) {
                    dispatch(
                        setWalletConnectionRequiredModalContent({
                            chainKey: ChainKey.Solana,
                        })
                    )
                    openWalletConnectionRequiredModal()
                    return
                }
                if (chainKey === ChainKey.Sui && !currentWallet) {
                    dispatch(
                        setWalletConnectionRequiredModalContent({
                            chainKey: ChainKey.Sui,
                        })
                    )
                    openWalletConnectionRequiredModal()
                    return
                }
                if (chainKey === ChainKey.Somnia) {
                    dispatch(
                        setWalletConnectionRequiredModalContent({
                            chainKey: ChainKey.Somnia,
                        })
                    )
                    openWalletConnectionRequiredModal()
                    return
                }
                onClick()
            }}
            disabled={isLoading}
            className="h-full"
            pressable
        >
            <CardBody className="relative w-full">
                <div className="absolute top-4 right-4">
                    {chainKey && (
                        <Image
                            src={
                                chainKeyMap.find((chain) => chain.key === chainKey)?.iconUrl ||
                ""
                            }
                            className="w-7 h-7"
                        />
                    )}
                </div>
                <Image src={imageUrl} className="w-32 h-32 object-contain" />
                <Spacer y={4} />
                <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        {isLoading && <Spinner />}
                        <div className="text-lg">{title}</div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <div>
                    <div className="text-muted-foreground">{description}</div>
                    <Spacer y={2} />
                    {content}
                </div>
            </CardFooter>
        </Card>
    )
}
