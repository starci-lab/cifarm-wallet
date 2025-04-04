import React from "react"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ListProps<TItem extends string | object> {
  items: Array<TItem>;
  contentCallback: (item: TItem) => React.ReactNode;
  enableScroll?: boolean;
  emptyMessage?: string;
}

export const List = <TItem extends string | object>({
    items,
    contentCallback,
    enableScroll = true,
    emptyMessage = "No items found",
}: ListProps<TItem>) => {
    const content = (<Card className="overflow-hidden">
        {items.map((item, index) => {
            const last = index === items.length - 1
            return (
                <React.Fragment key={index}>
                    {contentCallback(item)}
                    {!last && <Separator />}
                </React.Fragment>
            )
        })}
    </Card>)
    return (
        <>  
            {
                items.length > 0 ? (
                    enableScroll ? (
                        <ScrollArea className="h-[300px] relative -top-4 -left-4 p-4 w-[calc(100%+32px)]">
                            {content}
                        </ScrollArea>
                    ) : (
                        content
                    )
                ) : (
                    <div className="text-muted-foreground">{emptyMessage}</div>
                )
            }
        </>
    )
}
