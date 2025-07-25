import { DocumentNode, gql } from "@apollo/client"
import { noCacheAuthClient } from "../../auth-client"
import { UserSchema } from "@/types"
import {
    IPaginatedResponse, 
    QueryManyRequest,
    QueryParams,
    QueryVariables,
} from "../../types"
import { NeighborsSearchStatus } from "@/redux"
const query1 = gql`
  query Followees($request: FolloweesRequest!) {
    followees(request: $request) {  
      data {
        id
        level
        avatarUrl
        username
        golds
        isOnline
        followed
        lastOnlineTime
      }
      count
    }
  }
`

export type QueryFolloweesResponse = IPaginatedResponse<UserSchema>

export interface QueryFolloweesResponseWrapper {
  followees: QueryFolloweesResponse
}

export enum QueryFollowees {
  Query1 = "query1",
}

const queryMap: Record<QueryFollowees, DocumentNode> = {
    [QueryFollowees.Query1]: query1,
}

export interface QueryFolloweesArgs extends QueryManyRequest {
  searchString?: string;
  levelStart?: number
  levelEnd?: number
  status?: NeighborsSearchStatus
  useAdvancedSearch?: boolean
}

export type QueryFolloweesParams = QueryParams<QueryFollowees, QueryFolloweesArgs>;
export const queryFollowees = async ({
    query = QueryFollowees.Query1,
    request = { limit: 5, offset: 0 },
}: QueryFolloweesParams) => {
    const queryDocument = queryMap[query]
    return await noCacheAuthClient.query<
    QueryFolloweesResponseWrapper,
    QueryVariables<QueryFolloweesArgs>
  >({
      query: queryDocument,
      variables: {
          request,
      },
  })
}
