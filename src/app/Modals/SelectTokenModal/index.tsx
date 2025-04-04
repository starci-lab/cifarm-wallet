import { valuesWithKey } from "@/modules/common"
import { useAppSelector } from "@/redux"
import React, { useMemo, useState } from "react"
import { Token } from "./Token"
import { List, FilterBar, Spacer, ExtendedButton, ModalHeader } from "@/components"
import { SELECT_TOKEN_DISCLOSURE } from "@/app/constants"
import { useSingletonHook } from "@/modules/singleton-hook"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { useDisclosure } from "react-use-disclosure"

export const SelectTokenModal = () => {
    const { isOpen, toggle } = useSingletonHook<
    ReturnType<typeof useDisclosure>
  >(SELECT_TOKEN_DISCLOSURE)
    const tokens = useAppSelector((state) => state.sessionReducer.tokens)
    const tokensArray = valuesWithKey(tokens).filter((token) => token.enabled)
    const [searchString, setSearchString] = useState("")

    const filteredTokensArray = useMemo(() => {
        return tokensArray.filter((token) =>
            token.name.toLowerCase().includes(searchString.toLowerCase())
        )
    }, [searchString])
    
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader title="Select Token" description="Select a token to transfer." />
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <FilterBar
                        handleSearchResult={({ searchString }) => {
                            setSearchString(searchString)
                        }}
                    />
                    <Spacer y={4} />
                    <List
                        items={filteredTokensArray}
                        contentCallback={(token) => <Token token={token} />}
                    />
                </div>
                <DialogFooter>
                    <ExtendedButton
                        variant="ghost"
                        onClick={() => toggle(false)}
                        className="text-muted-foreground"
                    >
                        Cancel
                    </ExtendedButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
