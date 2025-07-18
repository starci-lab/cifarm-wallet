import {
    EmitterEventName,
    ForceSyncPlacedItemsMessage,
    ReceiverEventName,
    useSingletonHook,
    useWs,
    WS,
} from "@/singleton"
import { useEffect } from "react"
import {
    ExternalEventEmitter,
    ExternalEventName,
} from "@/modules/event-emitter"

export const useForceSyncPlacedItemsEffects = () => {
    const { socket } = useSingletonHook<ReturnType<typeof useWs>>(WS)

    useEffect(() => {
        if (!socket) {
            return
        }
        socket.on(ReceiverEventName.ForceSyncPlacedItemsResponsed, () => {
            console.log("force sync placed items responsed")
            ExternalEventEmitter.emit(
                ExternalEventName.ForceSyncPlacedItemsResponsed
            )
        })
        return () => {
            socket.off(ReceiverEventName.ForceSyncPlacedItemsResponsed)
        }
    }, [socket])

    useEffect(() => {
        ExternalEventEmitter.on(
            ExternalEventName.RequestForceSyncPlacedItems,
            ({ ids }: ForceSyncPlacedItemsMessage) => {
                if (!socket) {
                    return
                }
                socket.emit(EmitterEventName.ForceSyncPlacedItems, {
                    ids,
                })
            }
        )
        return () => {
            ExternalEventEmitter.removeListener(
                ExternalEventName.RequestForceSyncPlacedItems
            )
        }
    }, [socket])
}
