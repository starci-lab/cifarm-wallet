import { GAMEPLAY_IO } from "@/app/constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { EmitterEventName, UpgradeBuildingMessage, useWs } from "@/hooks"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useUpgradeBuildingEffects = () => {
    //authentication useEffect
    const { socket } = useSingletonHook<
        ReturnType<typeof useWs>
    >(GAMEPLAY_IO)
    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestUpgradeBuilding,
            async (message: UpgradeBuildingMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.UpgradeBuilding, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestUpgradeBuilding
            )
        }
    }, [socket])
}