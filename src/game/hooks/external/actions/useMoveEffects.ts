import { GAMEPLAY_IO } from "@/app/constants"
import { EmitterEventName, MoveMessage, useGameplayIo } from "@/hooks"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ExternalEventEmitter, ExternalEventName } from "../../../events"

export const useMoveEffects = () => {
    const { socket } =
    useSingletonHook<ReturnType<typeof useGameplayIo>>(GAMEPLAY_IO)

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestMove,
            async (message: MoveMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.Move, message)
            }
        )

        return () => {
            ExternalEventEmitter.removeListener(ExternalEventName.RequestMove)
        }
    }, [socket])
}
