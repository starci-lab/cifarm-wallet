import React, { FC } from "react"
import { ExclamationTooltip } from "../ExclamationTooltip"
import { cn } from "@/lib/utils"

export interface TitleProps {
  title: string;
  tooltipString: string;
  classNames?: {
    title?: string;
    tooltip?: string;
  };
}

export const Title: FC<TitleProps> = ({
    title,
    tooltipString,
    classNames = {},
}: TitleProps) => {
    const {
        title: titleClassName,
        tooltip: tooltipClassName,
    } = classNames
    return (
        <div className="flex items-center gap-2">
            <div
                className={cn(
                    "text-lg font-bold",
                    titleClassName
                )}
            >
                {title}
            </div>
            <ExclamationTooltip message={tooltipString} className={tooltipClassName} />
        </div>
    )
}
