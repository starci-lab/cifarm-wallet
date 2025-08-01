import { StaticAbstractSchema } from "./abstract"
import { ProductId, ProductType } from "@/types"

export interface ProductSchema extends StaticAbstractSchema<ProductId> {
    isQuality: boolean
    goldAmount: number
    type: ProductType
    crop: string
    animal: string
    fruit: string
    flower: string
    building: string
    qualityVersionOf: string
}
