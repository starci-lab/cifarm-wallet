"use client"
import { Container, Header, Spacer, PressableCard, List } from "@/components"
import { pathConstants } from "@/constants"
import { useRouterWithSearchParams } from "@/hooks"
import React, { FC, ReactNode } from "react"
import { ImportMethod } from "./types"
import { FileLock } from "@phosphor-icons/react"

const Page: FC = () => {
    const router = useRouterWithSearchParams()
    return (
        <Container hasPadding>
            <div className="h-full">
                <Header title="Import account" />
                <Spacer y={6} />
                <List items={Object.values(ImportMethod)} 
                    contentCallback={(item) => {
                        const map: Record<ImportMethod, ReactNode> = {
                            [ImportMethod.Mnemonic]: <PressableCard 
                                onClick={() => router.push(pathConstants.importFromMnemonic)}
                                showBorder={false} 
                                className="flex items-center gap-2 rounded-none">
                                <FileLock className="w-5 h-5"/>
                                <div className="text-sm">Import from mnemonic</div>
                            </PressableCard>,
                            // [ImportMethod.PrivateKey]: <PressableCard 
                            //     onClick={() => router.push(pathConstants.importFromPrivateKey)}
                            //     showBorder={false} 
                            //     className="flex items-center gap-2 rounded-none">
                            //     <KeyIcon className="w-5 h-5" />
                            //     <div className="text-sm">Import from private key</div>
                            // </PressableCard>,
                        }
                        return map[item]
                    }}/>
            </div>
        </Container>
    )
}

export default Page
