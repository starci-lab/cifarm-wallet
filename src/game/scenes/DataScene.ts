import { Scene } from "phaser"
import { EventBus, EventName } from "../event-bus"
import { InventorySchema, UserSchema } from "@/modules/entities"
import { CacheKey } from "../types"
import { SceneName } from "../scene"
import { IPaginatedResponse } from "@/modules/apollo"
import { PlacedItemsSyncedMessage } from "@/hooks"
//import { EventName } from "../event-bus"

export class DataScene extends Scene {
    constructor() {
        super(SceneName.Data)
    }
    
    create() {
        EventBus.on(EventName.UserRefreshed, (user: UserSchema) => {
            this.cache.obj.add(CacheKey.User, user)
        })

        EventBus.on(
            EventName.InventoriesRefreshed,
            (inventories: IPaginatedResponse<InventorySchema>) => {
                this.cache.obj.add(CacheKey.Inventories, inventories)
            }
        )

        EventBus.on(EventName.UpdateVisitedNeighbor, (user: UserSchema) => {
            this.cache.obj.add(CacheKey.VisitedNeighbor, user)
        })

        EventBus.on(
            EventName.PlacedItemsSynced,
            async (data: PlacedItemsSyncedMessage) => {
                //store the placed items in the cache
                this.cache.obj.add(CacheKey.PlacedItems, data)
                EventBus.emit(EventName.UpdatePlacedItems)
            }
        )
    }
}
