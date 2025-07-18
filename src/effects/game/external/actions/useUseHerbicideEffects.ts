import {
    useSingletonHook,
    useWs,
    EmitterEventName,
    WS,
    UseHerbicideMessage,
} from "@/singleton"
import { useEffect } from "react"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"

export const useUseHerbicideEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)
    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestUseHerbicide,
            async (message: UseHerbicideMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.UseHerbicide, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestUseHerbicide
            )
        }
    }, [socket])
}
