import { WS } from "@/app/(core)/constants"
import { useWs, ThiefPlantMessage, EmitterEventName } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "@/modules/event-emitter"

export const useThiefPlantEffects = () => {
    //authentication useEffect
    const { socket } =
    useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestThiefPlant,
            async (message: ThiefPlantMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.ThiefPlant, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestThiefPlant)
        }
    }, [socket])
}
