import { WS } from "@/app/constants"
import { useWs, EmitterEventName, HarvestBeeHouseMessage } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useHarvestBeeHouseEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestHarvestBeeHouse,
            async (message: HarvestBeeHouseMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.HarvestBeeHouse, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestHarvestBeeHouse
            )
        }
    }, [socket])
}
