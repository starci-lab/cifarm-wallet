"use client"
import { WARNING_MODAL_DISCLOSURE } from "@/singleton"
import { useSingletonHook } from "@/singleton"
import { useAppSelector } from "@/redux"
import React, { FC } from "react"
import { ExtendedButton, ModalHeader, DialogBody } from "@/components"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDisclosure } from "react-use-disclosure"

export const WarningModal: FC = () => {
    const { isOpen, toggle } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(WARNING_MODAL_DISCLOSURE)
    const message = useAppSelector(
        (state) => state.modalReducer.warningModal.message
    )
    const nextModalToken = useAppSelector(
        (state) => state.modalReducer.warningModal.nextModalToken
    )
    const callback = useAppSelector(
        (state) => state.modalReducer.warningModal.callback
    )
    if (nextModalToken && callback) {
        throw new Error(
            "WarningModal: nextModalToken and callback cannot be used together"
        )
    }

    // get the next modal disclosure
    const nextModalDisclosure =
    useSingletonHook<ReturnType<typeof useDisclosure>>(nextModalToken ?? "")
 
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader title="Warning" />
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Alert variant="destructive">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                </DialogBody>
                <DialogFooter>
                    <ExtendedButton 
                        color="ghost" 
                        onClick={() => toggle(false)}
                        className="text-muted-foreground"
                    >
                        Cancel
                    </ExtendedButton>
                    <ExtendedButton
                        color="destructive"
                        onClick={() => {
                            //close the current modal
                            toggle(false)
                            //open the next modal
                            if (callback) {
                                callback()
                            }
                            if (nextModalDisclosure) {
                                nextModalDisclosure.open()
                            }
                        }}
                    >
                        Continue
                    </ExtendedButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
