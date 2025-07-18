import { WithStatus } from "@/modules/common"
import {
    UserSchema,
    InventorySchema,
    PlacedItemSchema,
} from "@/types"
import { PartialDeep } from "type-fest"
import { EmitActionPayload } from "./actions"

// in constrast with server, Receiver => Emitter, Emitter => Receiver
export enum ReceiverEventName {
  UserSynced = "user_synced",
  PlacedItemsSynced = "placed_items_synced",
  ActionEmitted = "action_emitted",
  InventoriesSynced = "inventories_synced",
  BuyCropSeedsResponsed = "buy_crop_seeds_responsed",
  BuyFlowerSeedsResponsed = "buy_flower_seeds_responsed",
  BuySuppliesResponsed = "buy_supplies_responsed",
  BuyToolResponsed = "buy_tool_responsed",
  ClaimDailyRewardResponsed = "claim_daily_reward_responsed",
  PlantHarvested = "plant_harvested",
  WateringCanUsed = "watering_can_used",
  HerbicideUsed = "herbicide_used",
  PesticideUsed = "pesticide_used",
  StopBuying = "stop_buying",
  ForceSyncPlacedItemsResponsed = "force_sync_placed_items_responsed",
  YourAccountHasBeenLoggedInFromAnotherDevice = "your_account_has_been_logged_in_from_another_device",
}

// sync placed items
export interface SyncPlacedItemsMessage {
  placedItemIds: Array<string>;
}

// sync user
export interface UserSyncedMessage {
  data: PartialDeep<UserSchema>;
}

// sync inventories
export interface InventoriesSyncedMessage {
  data: Array<WithStatus<InventorySchema>>;
}

// sync placed items
export interface PlacedItemsSyncedMessage {
  data: Array<WithStatus<PlacedItemSchema>>;
}

// generic type for action emitted message
export interface ActionEmittedMessage {
  action: EmitActionPayload;
}

export interface InventorySyncedMessage {
  data: Array<WithStatus<InventorySchema>>;
}

export interface ForceSyncPlacedItemsMessage {
  ids: Array<string>;
}

