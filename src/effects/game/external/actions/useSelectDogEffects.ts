import {
    useSingletonHook,
    useWs,
    EmitterEventName,
    WS,
    SelectDogMessage,
} from "@/singleton"
import { useEffect } from "react"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"

export const useSelectDogEffects = () => {
    //authentication useEffect
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestSelectDog,
            async (message: SelectDogMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.SelectDog, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestSelectDog)
        }
    }, [socket])
}
