import { sessionDb, SessionDbKey } from "@/modules/dexie"

export const saveTokens = async ({ accessToken, refreshToken }: SaveTokenParams) => {
    //store the tokens in the indexeddb
    await Promise.all([
        sessionDb.keyValueStore.put({
            key: SessionDbKey.AccessToken,
            value: accessToken,
        }),
        sessionDb.keyValueStore.put({
            key: SessionDbKey.RefreshToken,
            value: refreshToken
        })
    ])
}

export interface SaveTokenParams {
    accessToken: string;
    refreshToken: string;
}