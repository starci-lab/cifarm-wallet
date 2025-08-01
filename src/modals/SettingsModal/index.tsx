import React, { FC, useEffect, useRef, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    Slider,
    DialogTitle,
    Title,
    Spacer,
    DialogBody,
} from "@/components"
import { useSingletonHook } from "@/singleton"
import { useDisclosure } from "react-use-disclosure"
import { SETTINGS_MODAL_DISCLOSURE } from "@/singleton"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"
import { useAppSelector } from "@/redux"

const TIMEOUT = 1000

export const SettingsModal: FC = () => {
    const { toggle, isOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        SETTINGS_MODAL_DISCLOSURE
    )
    const user = useAppSelector((state) => state.apiReducer.coreApi.user)
    const [sound, setSound] = useState(0.5)
    const [ambient, setAmbient] = useState(0.5)

    useEffect(() => {
        if (!user) {
            return
        }
        setSound(user.sound)
        setAmbient(user.ambient)
    }, [user])
    
    const preventFirstLoad = useRef(false)
    useEffect(() => {
        if (preventFirstLoad.current) {
            return
        }
        if (!user) {
            return
        }
        preventFirstLoad.current = true
        const delayTimeout = setTimeout(() => {
            ExternalEventEmitter.emit(ExternalEventName.RequestUpdateSettings, {
                sound,
                ambient,
            })
        }, TIMEOUT)
        return () => clearTimeout(delayTimeout)
    }, [sound, ambient])

    useEffect(() => {
        ExternalEventEmitter.emit(ExternalEventName.UpdateSound, {
            value: sound,
        })
    }, [sound])

    useEffect(() => {
        ExternalEventEmitter.emit(ExternalEventName.UpdateAmbient, {
            value: ambient,
        })
    }, [ambient])

    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        <Title
                            title="Sound"
                            tooltipString="This controls the audio settings."
                            classNames={{
                                title: "text-base",
                                tooltip: "w-4 h-4",
                            }}
                        />
                        <Spacer y={2} />
                        <Slider
                            value={[sound * 100]}
                            onValueChange={(value) => setSound(value[0] / 100)}
                        />
                    </div>
                    <Spacer y={4} />
                    <div>
                        <Title
                            title="Ambient"
                            tooltipString="This controls the audio settings."
                            classNames={{
                                title: "text-base",
                                tooltip: "w-4 h-4",
                            }}
                        />
                        <Spacer y={2} />
                        <Slider
                            value={[ambient * 100]}
                            onValueChange={(value) => setAmbient(value[0] / 100)}
                        />
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    )
}
