import { WS } from "@/app/(core)/constants"
import {
    useWs,
    HelpUseWateringCanMessage,
    EmitterEventName,
} from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "@/modules/event-emitter"

export const useHelpUseWateringCanEffects = () => {
    const { socket } =
    useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestHelpUseWateringCan,
            async (message: HelpUseWateringCanMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.HelpUseWateringCan, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestHelpUseWateringCan
            )
        }
    }, [socket])
}
