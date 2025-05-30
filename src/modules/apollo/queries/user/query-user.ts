import { DocumentNode, gql } from "@apollo/client"
import { noCacheAuthClient } from "../../auth-client"
import { UserSchema } from "@/modules/entities"
import { QueryParams } from "../../types"

const query1 = gql`
  query User { 
    user {
      id
      username
      dailyRewardLastClaimTime
      dailyRewardStreak
      energy
      energyFull
      energyRegenTime
      experiences
      golds
      level
      referralUserId
      referredUserIds
      followXAwarded
      sound
      ambient
      isOnline
      lastOnlineTime
      selectedPlacedItemDogId
      selectedPlacedItemCatId
      oauthProvider
      email
      avatarUrl
      credits
    }
  }
`

export interface QueryUserResponse {
    user: UserSchema
}


export enum QueryUser {
  Query1 = "query1",
}

const queryMap: Record<QueryUser, DocumentNode> = {
    [QueryUser.Query1]: query1,
}

export type QueryUserParams = QueryParams<QueryUser, string>;
export const queryUser = async ({ query = QueryUser.Query1, request }: QueryUserParams) => {
    const queryDocument = queryMap[query]
    return await noCacheAuthClient.query<QueryUserResponse>({
        query: queryDocument,
        variables: {
            id: request,
        },
    })
}
