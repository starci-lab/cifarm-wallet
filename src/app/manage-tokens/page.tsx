"use client"
import { useRouterWithSearchParams } from "@/hooks"
import {
    Button,
    Card,
    CardBody,
    Divider,
    Image,
    Link,
    Spacer,
    Switch,
} from "@heroui/react"
import { ArrowLeftIcon } from "lucide-react"
import { Container, QuestionTooltip } from "@/components"
import React, { FC } from "react"
import { switchToken, useAppDispatch, useAppSelector } from "@/redux"
import { valuesWithKey } from "@/modules/common"
import { PlusIcon } from "@heroicons/react/24/outline"

const Page: FC = () => {
    const router = useRouterWithSearchParams()
    const tokens = useAppSelector((state) => state.sessionReducer.tokens)
    const tokensArray = valuesWithKey(tokens)
    const dispatch = useAppDispatch()
    return (
        <Container hasPadding>
            <div className="h-full">
                <div>
                    <div className="flex gap-2 items-center">
                        <Link as="button" onPress={() => router.back()} color="foreground">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Link>
                        <div className="text-2xl font-bold">Manage Tokens</div>
                    </div>
                    <Spacer y={4} />
                    <div className="text-xs text-foreground-400">Manage your tokens.</div>
                </div>
                <Spacer y={12} />
                <div className="flex gap-2 items-center">
                    <div className="text-lg font-bold">Display Tokens</div>
                    <QuestionTooltip message="Select the tokens you want to display. Only tokens that are visible will be shown." />
                </div>
                <Spacer y={4} />
                <Card>
                    {tokensArray.map((token, index) => {
                        const last = index === tokensArray.length - 1
                        return (
                            <>
                                <Card key={token.key} radius="none" shadow="none">
                                    <CardBody>
                                        <div className="w-full justify-between flex items-center">
                                            <div className="flex gap-2 items-center">
                                                <Image
                                                    src={token.imageUrl}
                                                    alt={token.name}
                                                    className="w-8 h-8"
                                                />
                                                <div>
                                                    <div className="text-sm">{token.name}</div>
                                                    <div className="text-xs text-foreground-500">
                                                        {token.symbol}
                                                    </div>
                                                </div>
                                            </div>
                                            <Switch
                                                size="sm"
                                                isSelected={token.enabled}
                                                onValueChange={(value) =>
                                                    dispatch(
                                                        switchToken({ id: token.key, enabled: value })
                                                    )
                                                }
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                                {!last && <Divider />}
                            </>
                        )
                    })}
                </Card>
                <Spacer y={12} />
                <div>
                    <div className="flex gap-2 items-center">
                        <div className="text-lg font-bold">Import Token</div>
                        <QuestionTooltip message="Import a token manually." />
                    </div>
                    <Spacer y={4} />
                    <Button
                        startContent={<PlusIcon className="w-4 h-4" />}
                        variant="flat"
                    >
            Import
                    </Button>
                </div>
            </div>
        </Container>
    )
}

export default Page
