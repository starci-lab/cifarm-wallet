import { UseSWR } from "../../types"
import {
    queryInventories,
    QueryInventoriesResponse,
    QueryInventoriesParams,
} from "@/modules/apollo"
import { ApolloQueryResult } from "@apollo/client"
import { useState } from "react"
import { useAppSelector, useAppDispatch, setInventories } from "@/redux"
import useSWR from "swr"

export const useGraphQLQueryInventoriesSwr = (): UseSWR<
  ApolloQueryResult<QueryInventoriesResponse>,
  QueryInventoriesParams
> => {
    const [ params, setParams ] = useState<QueryInventoriesParams>({})
    const dispatch = useAppDispatch()
    const authenticated = useAppSelector(state => state.sessionReducer.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_INVENTORIES", params] : null,
        async () => {
            const response = await queryInventories(params)
            dispatch(setInventories(response.data.inventories))
            return response
        }
    )
    //return the state and the data
    return {
        swr,
        setParams,
        params
    }
} 