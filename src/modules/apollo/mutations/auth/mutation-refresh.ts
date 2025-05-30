import { DocumentNode, gql } from "@apollo/client"
import { noCacheClient } from "../../client"
import { MutationParams, MutationVariables } from "../../types"
import { GraphQLResponse } from "../types"

const mutation1 = gql`
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      success
      message
      data {
        accessToken
        refreshToken
        }
      }
  }
`

export enum MutationRefresh {
  Mutation1 = "mutation1",
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface MutationRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const mutationMap: Record<MutationRefresh, DocumentNode> = {
    [MutationRefresh.Mutation1]: mutation1,
}

export type MutationRefreshParams = MutationParams<MutationRefresh, RefreshRequest>;

export const mutationRefresh = async ({
    mutation = MutationRefresh.Mutation1,
    request
}: MutationRefreshParams) => {
    if (!request) {
        throw new Error("Request is required for refresh mutation")
    }
    
    const mutationDocument = mutationMap[mutation]
    return await noCacheClient.mutate<
    { refresh: GraphQLResponse<MutationRefreshResponse> },
    MutationVariables<RefreshRequest>
  >({
      mutation: mutationDocument,
      variables: { request }
  })
} 