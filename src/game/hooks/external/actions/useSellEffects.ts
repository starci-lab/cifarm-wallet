import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { useWs, EmitterEventName, SellMessage } from "@/hooks"
import { WS } from "@/app/constants"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useSellEffects = () => {
    //authentication useEffect
    const { socket } = useSingletonHook<
        ReturnType<typeof useWs>
    >(WS)
    
    useEffect(() => {
        ExternalEventEmitter.on(ExternalEventName.RequestSell, async (message: SellMessage) => {
            if (!socket) {
                return
            }
            socket.emit(EmitterEventName.Sell, message)
        })
        
        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestSell)
        }
    }, [socket])
}