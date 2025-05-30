import { UseSWR } from "../../types"
import {
    queryVaultCurrent,
    QueryVaultCurrentResponse,
    QueryVaultCurrentParams,
} from "@/modules/apollo"
import { ApolloQueryResult } from "@apollo/client"
import { useState } from "react"
import useSWR from "swr"

export const useGraphQLQueryVaultCurrentSwr = (): UseSWR<
  ApolloQueryResult<QueryVaultCurrentResponse>,
  QueryVaultCurrentParams
> => {
    const [ params, setParams ] = useState<QueryVaultCurrentParams>({})
    const swr = useSWR(
        "QUERY_VAULT_CURRENT",
        async () => {
            return await queryVaultCurrent(params)
        }
    )

    //return the state and the data
    return {
        swr,
        setParams,
        params
    }
} 