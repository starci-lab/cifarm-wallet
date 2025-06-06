"use client"
import React, { FC, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { saveTokens } from "@/modules/apollo/tokens"
import { useAppDispatch, setAuthenticated } from "@/redux"
import { useRouterWithSearchParams } from "@/hooks"
import { FallbackScene, FallbackSceneType } from "@/components"
import { pathConstants } from "@/constants"
const Page: FC = () => {
    const searchParams = useSearchParams()
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const router = useRouterWithSearchParams()
    
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!accessToken || !refreshToken) {
            return
        }
        const handleEffect = async () => {
            // store tokens in db
            await saveTokens({
                accessToken,
                refreshToken
            })
            // trigger authentication
            dispatch(setAuthenticated(true))

            //redirect to home
            router.push(pathConstants.home)
        }
        handleEffect()
    }, [accessToken, refreshToken])
    return <div className="h-screen w-screen">
        <FallbackScene type={FallbackSceneType.Authenticating} />
    </div>
}

export default Page

