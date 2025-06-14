"use client"
import { PRIVATE_KEY_DISCLOSURE } from "@/app/(core)/constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useAppSelector } from "@/redux"
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline"
import React, { FC, useState } from "react"
import { ExtendedButton, ModalHeader } from "@/components"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components"
import { cn } from "@/lib/utils"
import { useDisclosure } from "react-use-disclosure"
import { Copy } from "@phosphor-icons/react"

export const PrivateKeyModal: FC = () => {
    const { isOpen, toggle } = useSingletonHook<
    ReturnType<typeof useDisclosure>
  >(PRIVATE_KEY_DISCLOSURE)
    const [isBlurred, setIsBlurred] = useState(true)
    const accounts = useAppSelector(
        (state) => state.sessionReducer.accounts.accounts
    )
    const activateAccountId = useAppSelector(
        (state) => state.sessionReducer.accounts.activateAccountId
    )
    const account = accounts.find((account) => account.id === activateAccountId)
    if (!account) {
        return null
    }
    const { privateKey } = account
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader title="Private Key" description="Your private key is used to sign transactions. It is stored on your device and cannot be recovered if lost." />
                    </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <div className="relative">
                        {
                            isBlurred && (
                                <div className="absolute z-50 w-full h-full -top-1.5 -left-1.5 grid place-items-center">
                                    <EyeSlashIcon className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )
                        }
                        <div className={cn(
                            isBlurred ? "blur" : "", 
                            "bg-muted/40 p-3 rounded-md text-sm break-all"
                        )}>
                            {privateKey}
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    <ExtendedButton 
                        variant="outline"
                        onClick={() => setIsBlurred(!isBlurred)}
                        className="gap-2"
                    >
                        {isBlurred ? (
                            <EyeIcon className="w-5 h-5" />
                        ) : (
                            <EyeSlashIcon className="w-5 h-5" />
                        )}
                        {isBlurred ? "Show" : "Hide"}
                    </ExtendedButton>
                    <ExtendedButton
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(privateKey)}
                        className="gap-2"
                    >
                        <Copy className="w-5 h-5" />
                        Copy
                    </ExtendedButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
