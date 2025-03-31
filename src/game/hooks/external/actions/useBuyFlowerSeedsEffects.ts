import { GAMEPLAY_IO } from "@/app/constants"
import { BuyFlowerSeedsMessage, useGameplayIo } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { EmitterEventName, ReceiverEventName } from "@/hooks"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useBuyFlowerSeedsEffects = () => {
    //get the singleton instance of the buy seeds mutation
    const { socket } = useSingletonHook<ReturnType<typeof useGameplayIo>>(GAMEPLAY_IO)

    useEffect(() => {
        socket?.on(ReceiverEventName.FlowerSeedsBought, () => {
            ExternalEventEmitter.emit(ExternalEventName.BuyFlowerSeedsResponsed)
        })
        return () => {
            socket?.off(ReceiverEventName.FlowerSeedsBought)
        }
    }, [socket])
    useEffect(() => {
        ExternalEventEmitter.on(ExternalEventName.RequestBuyFlowerSeeds, async (message: BuyFlowerSeedsMessage) => {
            if (!socket) {
                return  
            }
            socket.emit(EmitterEventName.BuyFlowerSeeds, message)
            // return the user to the phaser
        })
    
        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestBuyFlowerSeeds)
        }
    }, [socket])
}