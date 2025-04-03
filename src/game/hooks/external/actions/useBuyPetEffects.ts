import { WS } from "@/app/constants"
import {
    useWs,
    EmitterEventName,
    BuyPetMessage,
} from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useBuyPetEffects = () => {
    const { socket } =
    useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestBuyPet,
            async (message: BuyPetMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.BuyPet, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestBuyPet)
        }
    }, [socket])
}
