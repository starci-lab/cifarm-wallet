import { Card, CardContent, ScaledImage, TooltipTrigger, Tooltip, TooltipContent } from "@/components"
import { cn } from "@/lib/utils"
import React, { FC } from "react"

export enum TintColor {
    Default = "default",
    Green = "green",
}

interface ItemCardProps {
  quantity?: number;
  stackable?: boolean;
  imageUrl?: string;
  frameOnly?: boolean;
  onClick?: () => void;
  tint?: boolean;
  tintColor?: TintColor;
  hideCardContentBg?: boolean;
  classNames?: {
    card?: string
    cardContent?: string
  }
  name?: string;
  description?: string;
  showTooltip?: boolean;
}

export const ItemCard: FC<ItemCardProps> = ({
    name,
    description,
    showTooltip = false,
    ...props
}) => {
    return (<>
        {showTooltip && !props.frameOnly ? (
            <>
                <Tooltip>
                    <TooltipTrigger>
                        <ItemCardCore {...props} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <div>
                            <div className="text-sm">{name}</div>
                            <div className="text-xs">{description}</div>
                        </div>
                    </TooltipContent>    
                </Tooltip>
                
            </>
        ) : (
            <ItemCardCore {...props} />
        )}
    </>)
}

const ItemCardCore: FC<ItemCardProps> = ({
    quantity,
    stackable,
    imageUrl,
    frameOnly,
    onClick,
    tint,
    tintColor,
    hideCardContentBg = false,
    classNames = {},
}) => {

    const tintMap: Record<TintColor, string> = {
        [TintColor.Default]: "grayscale(100%)",
        [TintColor.Green]: "grayscale(100%)",
    }
    return (
        <Card
            className={cn(
                "w-fit h-fit p-0 min-w-fit min-h-fit border-none shadow-none cursor-pointer bg-transparent",
                classNames.card
            )}
            onClick={onClick}
        >
            <CardContent
                className={cn(
                    "grid place-items-center p-0 w-14 h-14 relative rounded-md",
                    classNames.cardContent,
                    {
                        "bg-card": !hideCardContentBg,
                    }
                )}
            >
                {!frameOnly &&
          (() => {
              return (
                  <div className="absolute w-12 h-12">
                      <ScaledImage
                          src={imageUrl ?? ""}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                              filter: tint ? tintMap[tintColor ?? TintColor.Default] : "grayscale(0%)",
                          }}
                      />
                      {stackable && (
                          <div className="absolute bottom-0 right-0 bg-background/50 text-xs grid place-items-center rounded-md p-0.5">
                              {quantity}
                          </div>
                      )}
                  </div>
              )
          })()}
            </CardContent>
        </Card>
    )
}
