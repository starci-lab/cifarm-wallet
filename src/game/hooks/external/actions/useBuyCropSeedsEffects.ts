import { GAMEPLAY_IO } from "@/app/constants"
import { BuyCropSeedsMessage, EmitterEventName, ReceiverEventName, useGameplayIo } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useBuyCropSeedsEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useGameplayIo>>(GAMEPLAY_IO)

    useEffect(() => {
        socket?.on(ReceiverEventName.CropSeedsBought, () => {
            ExternalEventEmitter.emit(ExternalEventName.BuyCropSeedsResponsed)
        })

        return () => {
            socket?.off(ReceiverEventName.CropSeedsBought)
        }
    }, [socket])
    
    useEffect(() => {
        ExternalEventEmitter.on(ExternalEventName.RequestBuyCropSeeds, async (message: BuyCropSeedsMessage) => {
            if (!socket) {
                return
            }
            socket.emit(EmitterEventName.BuyCropSeeds, message)
            // return the user to the phaser game
        })
    
        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestBuyCropSeeds)
        }
    }, [socket])
}