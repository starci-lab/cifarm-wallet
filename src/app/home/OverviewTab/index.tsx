import { BlurEffect, Card, CardContent, CardHeader, CardTitle, ExtendedBadge, Image, Separator } from "@/components"
import { ExtendedButton } from "@/components"
import React, { FC } from "react"
import { MainVisual } from "../MainVisual"
import { pathConstants } from "@/constants"
import { useRouterWithSearchParams } from "@/hooks"
import { ShareNetwork } from "@phosphor-icons/react"

const tags = [{ name: "Farming" }, { name: "Social" }, { name: "Strategy" }]

export const OverviewTab: FC = () => {
    const router = useRouterWithSearchParams()
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                    <MainVisual />
                </div>

                <div className="flex flex-col gap-3 mt-4 md:mt-0 relative min-w-[200px] col-span-1 md:col-span-2 lg:col-span-1">
                    <ExtendedButton
                        color="gradient-secondary"
                        className="items-center justify-center gap-2 w-[calc(100vw-3rem)] md:w-full z-50 fixed md:relative bottom-16 md:bottom-0 md:flex"
                        size="lg"
                        variant="flat"
                        onClick={() => {
                            router.push(pathConstants.play)
                        }}
                    >
                        Play
                    </ExtendedButton>
                    <BlurEffect size="sm" position="top" className="-z-20 hover:opacity-80 transition-opacity duration-200" />

                    <ExtendedButton className="flex items-center justify-center gap-2 w-full md:w-auto z-10" color="secondary"
                        variant="flat"
                    >
                        <ShareNetwork className="w-4 h-4" />
                        Share
                    </ExtendedButton>

                    <Card variant="default">
                        <CardHeader className="py-4 py-3">
                            <CardTitle className="text-xl font-bold text-foreground">Details</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <ExtendedBadge
                                        key={index}
                                        variant="primary"
                                    >
                                        {tag.name}
                                    </ExtendedBadge>
                                ))}
                            </div>
                            <div className="flex justify-between gap-2 mt-4">
                                <div className="flex items-center gap-2 text-sm uppercase">Game Framework</div>
                                <div className="flex items-center gap-1">
                                    <Image src="https://i0.wp.com/technotip.com/wp-content/uploads/phaser/phaser-logo.png?w=840" className="h-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Description Section */}
            <div className="mt-8 pb-32">
                <h2 className="text-xl font-bold mb-4 text-foreground">Description</h2>
                <Card className="py-5 px-6">
                    <div className="text-muted-foreground text-justify">
                    CiFarm is a social farming game where players can farm, steal, and earn rewards. It features a unique business model designed to create long-term value and high user engagement across game seasons.
                    </div>
                </Card>
            </div>

        </div>
        
    )
}
