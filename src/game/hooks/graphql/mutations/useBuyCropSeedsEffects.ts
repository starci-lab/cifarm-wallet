import { GAMEPLAY_IO } from "@/app/constants"
import { BuyCropSeedsMessage, useGameplayIo } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { EventBus, EventName } from "../../../event-bus"
import { EmitterEventName } from "@/hooks/io/events"

export const useBuyCropSeedsEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useGameplayIo>>(GAMEPLAY_IO)
    
    useEffect(() => {
        EventBus.on(EventName.RequestBuyCropSeeds, async (message: BuyCropSeedsMessage) => {
            if (!socket) {
                return
            }
            socket.emit(EmitterEventName.BuyCropSeeds, message)
            // return the user to the phaser game
        })
    
        return () => {
            EventBus.removeListener(EventName.RequestBuyCropSeeds)
        }
    }, [socket])
}