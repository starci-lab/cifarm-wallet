import { WS } from "@/app/(core)/constants"
import { useEffect } from "react"
import { BuyFruitMessage, useWs, EmitterEventName } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { ExternalEventEmitter, ExternalEventName } from "@/modules/event-emitter"

export const useBuyFruitEffects = () => {
    const { socket } =
    useSingletonHook<ReturnType<typeof useWs>>(WS)
    
    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestBuyFruit,
            async (message: BuyFruitMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.BuyFruit, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestBuyFruit
            )
        }
    }, [socket])
}
