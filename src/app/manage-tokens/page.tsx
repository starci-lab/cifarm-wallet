"use client"
import { Button, Container, FilterBar, Header, List, Spacer, Title } from "@/components"
import React, { FC } from "react"
import { useAppSelector } from "@/redux"
import { valuesWithKey } from "@/modules/common"
import { Token } from "./Token"
import { PlusIcon, RotateCcwIcon } from "lucide-react"

const Page: FC = () => {
    const tokens = useAppSelector((state) => state.sessionReducer.tokens)
    const tokensArray = valuesWithKey(tokens)
    const selectedTokenArray = tokensArray.filter((token) => token.enabled)
    const availableTokenArray = tokensArray.filter((token) => !token.enabled)
    return (
        <Container hasPadding>
            <div>
                <Header title="Manage Tokens" description="Manage the tokens" />
                <Spacer y={6} />
                <FilterBar handleSearchResult={() => { }} />
                <Spacer y={4} />
                <div className="flex justify-between w-full items-center">
                    <Title title="Selected Tokens" tooltipString="Selected tokens will be displayed in the wallet" />
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <PlusIcon className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <RotateCcwIcon className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
                <Spacer y={2} />
                <List
                    enableScroll={false}
                    items={selectedTokenArray}
                    contentCallback={(item) => {
                        return <Token token={item} />
                    }}
                />
                <Spacer y={6} />
                <div>
                    <Title title="Available Tokens" tooltipString="Available tokens will not display in the list, but you can add them anytime." />
                    <Spacer y={2} />
                    <List
                        enableScroll={false}
                        items={availableTokenArray}
                        contentCallback={(item) => {
                            return <Token token={item} />
                        }}
                    />
                </div>
            </div>
        </Container>
    )
}

export default Page
