// component to fetch the balance of a token via SWR
import React, { useEffect } from "react"
import { useBalanceSwr } from "./useBalanceSwr"
import { removeBalanceSwr, setBalanceSwr } from "@/redux"
import { useAppDispatch } from "@/redux"

interface BalanceComponentProps {
  tokenKey: string;
  useHoneycombProtocol?: boolean;
}

export const BalanceComponent = ({
    tokenKey,
    useHoneycombProtocol,
}: BalanceComponentProps) => {
    const dispatch = useAppDispatch()
    const { swr } = useBalanceSwr({
        useHoneycombProtocol,
        tokenKey,
    })

    useEffect(() => {
        dispatch(
            setBalanceSwr({
                tokenKey,
                swr,
            })
        )
    }, [swr])

    useEffect(() => {
        return () => {
            dispatch(removeBalanceSwr(tokenKey))
        }
    }, [])

    return <></>
}
