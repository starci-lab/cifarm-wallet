"use client"
import { INVITE_USER_DISCLOSURE, GRAPHQL_QUERY_USER_SWR } from "@/app/constants"
import { useGraphQLQueryUserSwr } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import React, { FC, useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components"
import { useDisclosure } from "react-use-disclosure"
import { ModalHeader, Snippet, Spacer } from "@/components"
import { Alert, AlertDescription } from "@/components/ui/alert"
export const InviteUserModal: FC = () => {
    const { isOpen, toggle } = useSingletonHook<
    ReturnType<typeof useDisclosure>
  >(INVITE_USER_DISCLOSURE)

    const { swr } = useSingletonHook<ReturnType<typeof useGraphQLQueryUserSwr>>(GRAPHQL_QUERY_USER_SWR)

    const [webUrl, setWebUrl] = useState("")

    useEffect(() => {
        setWebUrl(`${window.location.href}?${123}=${swr.data?.data.user.id}`)
    }, [])

    const telegramUrl = `https://t.me/cifarm_bot?startapp=${swr.data?.data.user.id}`
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader title="Invite User" />
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className="text-sm text-muted-foreground">
                        Share the link through your social network; users with the referral code will receive bonus tokens, and you will earn extra tokens as well.
                    </div>
                    <Spacer y={4} />
                    <div>
                        <div className="text-sm mb-1.5">Web URL</div>
                        <Spacer y={2} />
                        <Alert>
                            <AlertDescription> 
                                <div className="flex items-center gap-2 justify-between w-full">
                                    <div className="text-sm">
                                        {webUrl}
                                    </div>
                                    <Snippet code={webUrl} />
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                    <Spacer y={4} />
                    <div className="w-full">
                        <div className="text-sm mb-1.5">Telegram URL</div>
                        <Spacer y={2} />
                        <Alert>
                            <AlertDescription> 
                                <div className="flex items-center gap-2 justify-between w-full">
                                    <div className="text-sm">
                                        {telegramUrl}
                                    </div>
                                    <Snippet code={telegramUrl} />
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
