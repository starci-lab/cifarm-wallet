import { GRAPHQL_MUTATION_MOVE_SWR_MUTATION } from "@/app/constants"
import { useGraphQLMutationMoveSwrMutation } from "@/hooks"
import { MoveRequest } from "@/modules/apollo"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { ResponsedMessage, EventBus, EventName } from "../../../event-bus"

export const useMoveEffects = () => {
    const { swrMutation } = useSingletonHook<
        ReturnType<typeof useGraphQLMutationMoveSwrMutation>
      >(GRAPHQL_MUTATION_MOVE_SWR_MUTATION)
    
    useEffect(() => {
        EventBus.on(EventName.RequestMove, async (message: MoveRequest) => {
            let completedMessage: ResponsedMessage
            try {
                await swrMutation.trigger({ request: message })
                completedMessage = {
                    success: true,
                }
            } catch (error) {
                console.error(error)
                completedMessage = {
                    success: false,
                }
            }
            // return the user to the phaser game
            EventBus.emit(EventName.MoveResponsed, completedMessage)
        })
    
        return () => {
            EventBus.removeListener(EventName.RequestMove)
        }
    }, [swrMutation])
}