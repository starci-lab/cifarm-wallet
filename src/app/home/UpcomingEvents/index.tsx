import { ExclamationTooltip } from "@/components"
import React, { FC } from "react"

export const UpcomingEvents: FC = () => {
    return (
        <div>
            <div className="flex gap-2 items-center">
                <div className="text-lg font-bold">Upcoming Events</div>
                <ExclamationTooltip message="Upcoming events and activities for CiFarmers." />
            </div>
            <div className="h-4" />
            <div>
                Currently, there are no upcoming events.
            </div>
        </div>
    )
}
