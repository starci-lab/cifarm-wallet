import { BuyTileMessage, EmitterEventName, useWs } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"
import { GAMEPLAY_IO } from "@/app/constants"

export const useBuyTileEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(GAMEPLAY_IO)

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