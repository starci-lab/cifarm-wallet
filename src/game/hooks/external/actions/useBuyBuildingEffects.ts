import { WS } from "@/app/constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { BuyBuildingMessage, EmitterEventName, useWs } from "@/hooks"
import { ExternalEventEmitter, ExternalEventName, } from "../../../events"

export const useBuyBuildingEffects = () => {

    const { socket } =
        useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestBuyBuilding,
            async (message: BuyBuildingMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.BuyBuilding, message)
            })

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestBuyBuilding)
        }
    }, [socket])
}
