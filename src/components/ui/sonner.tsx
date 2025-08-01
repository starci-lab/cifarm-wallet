"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import React from "react"
import { cn } from "@/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()
    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
            cn("group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-none"),
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
