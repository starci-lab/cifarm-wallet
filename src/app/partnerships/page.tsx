"use client"

import { Container } from "@/components"
import React, { FC } from "react"
const Page: FC = () => {
    return (
        <Container hasPadding>
            {/* <div className="h-full">
                <div>
                    <div className="flex gap-2 items-center">
                        <Link as="button" onClick={() => router.back()} color="foreground">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div className="text-2xl font-bold">Partnerships</div>
                    </div>
                    <Spacer y={4} />
                    <div className="text-xs text-muted-foreground">
                        The partnerships of CiFarm engage in integration and simplify the platform, also boosting the user experience.
                    </div>
                </div>
                <Spacer y={6} />
                <div>
                    <div className="flex gap-2 items-center">
                        <div className="text-lg font-bold">Available Partnerships</div>
                        <ExclamationTooltip message="Select the chain you want to use." />
                    </div>
                    <Spacer y={4} />
                    <Card>
                        <div className="grid">
                            {valuesWithKey(partnerships).map(({ key, name, description, logo, onPress }, index) => {
                                const last = index === Object.values(partnerships).length - 1
                                return (
                                    <React.Fragment key={key}>
                                        <Card
                                            radius="none"
                                            shadow="none"
                                            isPressable={true}
                                            disableRipple={true}
                                            onClick={onPress}
                                        >
                                            <CardBody className="flex gap-2">
                                                <div className="w-full flex gap-2">
                                                    <Image
                                                        src={logo}
                                                        radius="none"
                                                        className="w-12 h-12 min-w-12"
                                                    />
                                                    <div>
                                                        <div className="text-sm">{name}</div>
                                                        <div className="text-xs text-muted-foreground">{description}</div>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                        {!last && <Divider />}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </Card>
                </div>
            </div> */}
        </Container>
    )
}

export default Page
