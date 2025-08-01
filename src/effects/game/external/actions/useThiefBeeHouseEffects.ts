import {
    useSingletonHook,
    useWs,
    EmitterEventName,
    WS,
    ThiefBeeHouseMessage,
} from "@/singleton"
import { useEffect } from "react"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"

export const useThiefBeeHouseEffects = () => {
    //authentication useEffect
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestThiefBeeHouse,
            async (message: ThiefBeeHouseMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.ThiefBeeHouse, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestThiefBeeHouse
            )
        }
    }, [socket])
}
