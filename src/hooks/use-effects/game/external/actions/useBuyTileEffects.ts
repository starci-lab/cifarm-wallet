import { BuyTileMessage, EmitterEventName, useWs } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "@/modules/event-emitter"
import { WS } from "@/app/(core)/constants"

export const useBuyTileEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestBuyTile,
            async (message: BuyTileMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.BuyTile, message)
            }
        )
    
        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestBuyTile)
        }
    }, [socket])
}