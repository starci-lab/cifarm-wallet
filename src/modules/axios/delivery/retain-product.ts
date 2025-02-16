import { AxiosResponse } from "axios"
import { authAxios } from "../auth-axios"
import { AxiosOptions, Version } from "../types"
import { EmptyObject } from "@/modules/common"

export const updateTutorial = ({ version = Version.V1 }: AxiosOptions = {}) =>
    authAxios.post<EmptyObject, AxiosResponse<EmptyObject>, EmptyObject>(
        `${version}/gameplay/update-tutorial`
    )
