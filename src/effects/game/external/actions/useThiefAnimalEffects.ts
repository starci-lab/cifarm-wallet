import {
    useSingletonHook,
    useWs,
    EmitterEventName,
    WS,
    ThiefAnimalMessage,
} from "@/singleton"
import { useEffect } from "react"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"

export const useThiefAnimalEffects = () => {
    //authentication useEffect
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestThiefAnimal,
            async (message: ThiefAnimalMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.ThiefAnimal, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestThiefAnimal)
        }
    }, [socket])
}
