"use client"
import { QUESTS_MODAL_DISCLOSURE } from "@/singleton"
import { useSingletonHook } from "@/singleton"
import React, { FC, ReactNode } from "react"
import { DailyTab } from "./DailyTab"
import { GameTab } from "./GameTab"
import { PartnershipTab } from "./PartnershipTab"
import { SocialTab } from "./SocialTab"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogTitle,
} from "@/components"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useDisclosure } from "react-use-disclosure"
import { useAppSelector, useAppDispatch, QuestsTab as QuestsTabEnum, setQuestsTab } from "@/redux"
export const    QuestsModal: FC = () => {
    const { toggle, isOpen } =
    useSingletonHook<ReturnType<typeof useDisclosure>>(QUESTS_MODAL_DISCLOSURE)

    const selectedTab = useAppSelector((state) => state.tabReducer.questsTab)
    const dispatch = useAppDispatch()

    const renderTab = () => {
        const map: Record<QuestsTabEnum, ReactNode> = {
            [QuestsTabEnum.Social]: <SocialTab />,
            [QuestsTabEnum.Game]: <GameTab />,
            [QuestsTabEnum.Daily]: <DailyTab />,
            [QuestsTabEnum.Partnership]: <PartnershipTab />,
        }
        return map[selectedTab]
    }
    
    return (
        <Dialog 
            open={isOpen} 
            onOpenChange={toggle}
        >
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Quests</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Tabs
                        defaultValue={selectedTab}
                        onValueChange={(value) => dispatch(setQuestsTab(value as QuestsTabEnum))}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger color="secondary" value={QuestsTabEnum.Social}>Social</TabsTrigger>
                            <TabsTrigger color="secondary" value={QuestsTabEnum.Game}>Game</TabsTrigger>
                            <TabsTrigger color="secondary" value={QuestsTabEnum.Daily}>Daily</TabsTrigger>
                            <TabsTrigger color="secondary" value={QuestsTabEnum.Partnership}>Partnership</TabsTrigger>
                        </TabsList>
                        <TabsContent value={selectedTab}>
                            {renderTab()}
                        </TabsContent>
                    </Tabs>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}