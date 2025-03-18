import { GRAPHQL_MUTATION_HELP_USE_PESTICIDE_SWR_MUTATION } from "@/app/constants"
import { useGraphQLMutationHelpUsePesticideSwrMutation } from "@/hooks"
import { HelpUsePesticideRequest } from "@/modules/apollo"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useEffect } from "react"
import { CompletedMessage, EventBus, EventName } from "../../../event-bus"

export const useHelpWaterCropEffects = () => {
    //authentication useEffect
    const { swrMutation } = useSingletonHook<
        ReturnType<typeof useGraphQLMutationHelpUsePesticideSwrMutation>
      >(GRAPHQL_MUTATION_HELP_USE_PESTICIDE_SWR_MUTATION)
    
    useEffect(() => {
        EventBus.on(EventName.RequestHelpWaterCrop, async (message: HelpUsePesticideRequest) => {
            let completedMessage: CompletedMessage
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
            EventBus.emit(EventName.HelpWaterCropCompleted, completedMessage)
        })
    
        return () => {
            EventBus.removeListener(EventName.RequestHelpWaterCrop)
        }
    }, [swrMutation])
}