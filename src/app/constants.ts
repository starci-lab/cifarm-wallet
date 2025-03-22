/**
 * Constants for the CiFarm Wallet
 * This file defines all constants used throughout the application
 */

// =====================================
// DISCLOSURE CONSTANTS
// =====================================
export const PRIVATE_KEY_DISCLOSURE = "PRIVATE_KEY_DISCLOSURE"
export const MNEMONIC_DISCLOSURE = "MNEMONIC_DISCLOSURE"
export const WARNING_DISCLOSURE = "WARNING_DISCLOSURE"
export const SIGN_TRANSACTION_DISCLOSURE = "SIGN_TRANSACTION_DISCLOSURE"
export const TOKENS_OFFCHAIN_DISCLOSURE = "TOKENS_OFFCHAIN_DISCLOSURE"
export const GOLDS_DISCLOSURE = "GOLDS_DISCLOSURE"
export const PROFILE_DISCLOSURE = "PROFILE_DISCLOSURE"
export const INVITE_USER_DISCLOSURE = "INVITE_USER_DISCLOSURE"
export const MINT_AMOUNT_DISCLOSURE = "MINT_AMOUNT_DISCLOSURE"
export const NEIGHBORS_DISCLOSURE = "NEIGHBORS_DISCLOSURE"
export const QUESTS_DISCLOSURE = "QUESTS_DISCLOSURE"
export const SELECT_TOKEN_DISCLOSURE = "SELECT_TOKEN_DISCLOSURE"

// =====================================
// FORM HOOK CONSTANTS
// =====================================
// React Hook Form constants
export const MINT_OFFCHAIN_TOKENS_RHF = "MINT_OFFCHAIN_TOKENS_RHF"
export const TRANSFER_TOKEN_RHF = "TRANSFER_TOKEN_RHF"

// Formik constants
export const TRANSFER_TOKEN_FORMIK = "TRANSFER_TOKEN_FORMIK"

// =====================================
// SWR CONSTANTS
// =====================================
export const NATIVE_COINGEKCO_SWR = "NATIVE_COINGEKCO_SWR"

// =====================================
// GRAPHQL MUTATION CONSTANTS
// =====================================

// Auth & User mutations
export const GRAPHQL_MUTATION_AUTHENTICATION_SWR_MUTATION = "GRAPHQL_MUTATION_AUTHENTICATION_SWR_MUTATION"
export const GRAPHQL_MUTATION_UPDATE_TUTORIAL_SWR_MUTATION = "GRAPHQL_MUTATION_UPDATE_TUTORIAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_UPDATE_REFERRAL_SWR_MUTATION = "GRAPHQL_MUTATION_UPDATE_REFERRAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_UPDATE_FOLLOW_X_SWR_MUTATION = "GRAPHQL_MUTATION_UPDATE_FOLLOW_X_SWR_MUTATION"

// Reward mutations
export const GRAPHQL_MUTATION_CLAIM_DAILY_REWARD_SWR_MUTATION = "GRAPHQL_MUTATION_CLAIM_DAILY_REWARD_SWR_MUTATION"
export const GRAPHQL_MUTATION_CLAIM_HONEYCOMB_DAILY_REWARD_SWR_MUTATION = "GRAPHQL_MUTATION_CLAIM_HONEYCOMB_DAILY_REWARD_SWR_MUTATION"
export const GRAPHQL_MUTATION_MINT_OFFCHAIN_TOKENS_SWR_MUTATION = "GRAPHQL_MUTATION_MINT_OFFCHAIN_TOKENS_SWR_MUTATION"
export const GRAPHQL_MUTATION_SPIN_SWR_MUTATION = "GRAPHQL_MUTATION_SPIN_SWR_MUTATION"

// Animal related mutations
export const GRAPHQL_MUTATION_HELP_FEED_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_FEED_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_CURE_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_CURE_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_COLLECT_ANIMAL_PRODUCT_SWR_MUTATION = "GRAPHQL_MUTATION_COLLECT_ANIMAL_PRODUCT_SWR_MUTATION"
export const GRAPHQL_MUTATION_CURE_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_CURE_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_FEED_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_FEED_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_HARVEST_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_HARVEST_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_ANIMAL_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_ANIMAL_SWR_MUTATION"
export const GRAPHQL_MUTATION_THIEF_ANIMAL_PRODUCT_SWR_MUTATION = "GRAPHQL_MUTATION_THIEF_ANIMAL_PRODUCT_SWR_MUTATION"

// Crop related mutations
export const GRAPHQL_MUTATION_HARVEST_CROP_SWR_MUTATION = "GRAPHQL_MUTATION_HARVEST_CROP_SWR_MUTATION"
export const GRAPHQL_MUTATION_PLANT_SEED_SWR_MUTATION = "GRAPHQL_MUTATION_PLANT_SEED_SWR_MUTATION"
export const GRAPHQL_MUTATION_WATER_CROP_SWR_MUTATION = "GRAPHQL_MUTATION_WATER_CROP_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_WATER_CROP_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_WATER_CROP_SWR_MUTATION"
export const GRAPHQL_MUTATION_THIEF_CROP_SWR_MUTATION = "GRAPHQL_MUTATION_THIEF_CROP_SWR_MUTATION"

// Fruit related mutations
export const GRAPHQL_MUTATION_HARVEST_FRUIT_SWR_MUTATION = "GRAPHQL_MUTATION_HARVEST_FRUIT_SWR_MUTATION"
export const GRAPHQL_MUTATION_THIEF_FRUIT_SWR_MUTATION = "GRAPHQL_MUTATION_THIEF_FRUIT_SWR_MUTATION"
export const GRAPHQL_MUTATION_USE_FRUIT_FERTILIZER_SWR_MUTATION = "GRAPHQL_MUTATION_USE_FRUIT_FERTILIZER_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_USE_FRUIT_FERTILIZER_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_USE_FRUIT_FERTILIZER_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_FRUIT_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_FRUIT_SWR_MUTATION"

// Tool & supply related mutations
export const GRAPHQL_MUTATION_USE_BUG_NET_SWR_MUTATION = "GRAPHQL_MUTATION_USE_BUG_NET_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_USE_BUG_NET_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_USE_BUG_NET_SWR_MUTATION"
export const GRAPHQL_MUTATION_USE_FERTILIZER_SWR_MUTATION = "GRAPHQL_MUTATION_USE_FERTILIZER_SWR_MUTATION"
export const GRAPHQL_MUTATION_USE_HERBICIDE_SWR_MUTATION = "GRAPHQL_MUTATION_USE_HERBICIDE_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_USE_HERBICIDE_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_USE_HERBICIDE_SWR_MUTATION"
export const GRAPHQL_MUTATION_USE_PESTICIDE_SWR_MUTATION = "GRAPHQL_MUTATION_USE_PESTICIDE_SWR_MUTATION"
export const GRAPHQL_MUTATION_HELP_USE_PESTICIDE_SWR_MUTATION = "GRAPHQL_MUTATION_HELP_USE_PESTICIDE_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_TOOL_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_TOOL_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_SUPPLIES_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_SUPPLIES_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_SEEDS_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_SEEDS_SWR_MUTATION"

// Building related mutations
export const GRAPHQL_MUTATION_UPGRADE_BUILDING_SWR_MUTATION = "GRAPHQL_MUTATION_UPGRADE_BUILDING_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_BUILDING_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_BUILDING_SWR_MUTATION"
export const GRAPHQL_MUTATION_BUY_TILE_SWR_MUTATION = "GRAPHQL_MUTATION_BUY_TILE_SWR_MUTATION"

// Inventory related mutations
export const GRAPHQL_MUTATION_UPDATE_INVENTORY_INDEX_SWR_MUTATION = "GRAPHQL_MUTATION_UPDATE_INVENTORY_INDEX_SWR_MUTATION"
export const GRAPHQL_MUTATION_MOVE_INVENTORY_SWR_MUTATION = "GRAPHQL_MUTATION_MOVE_INVENTORY_SWR_MUTATION"
export const GRAPHQL_MUTATION_MOVE_SWR_MUTATION = "GRAPHQL_MUTATION_MOVE_SWR_MUTATION"

// Product related mutations
export const GRAPHQL_MUTATION_DELIVER_PRODUCT_SWR_MUTATION = "GRAPHQL_MUTATION_DELIVER_PRODUCT_SWR_MUTATION"
export const GRAPHQL_MUTATION_DELIVER_MORE_PRODUCT_SWR_MUTATION = "GRAPHQL_MUTATION_DELIVER_MORE_PRODUCT_SWR_MUTATION"
export const GRAPHQL_MUTATION_RETAIN_PRODUCT_SWR_MUTATION = "GRAPHQL_MUTATION_RETAIN_PRODUCT_SWR_MUTATION"
export const GRAPHQL_MUTATION_SELL_SWR_MUTATION = "GRAPHQL_MUTATION_SELL_SWR_MUTATION"

// Social related mutations
export const GRAPHQL_MUTATION_FOLLOW_SWR_MUTATION = "GRAPHQL_MUTATION_FOLLOW_SWR_MUTATION"
export const GRAPHQL_MUTATION_UNFOLLOW_SWR_MUTATION = "GRAPHQL_MUTATION_UNFOLLOW_SWR_MUTATION"
export const GRAPHQL_MUTATION_VISIT_SWR_MUTATION = "GRAPHQL_MUTATION_VISIT_SWR_MUTATION"
export const GRAPHQL_MUTATION_RETURN_SWR_MUTATION = "GRAPHQL_MUTATION_RETURN_SWR_MUTATION"

// =====================================
// GRAPHQL QUERY CONSTANTS
// =====================================
export const GRAPHQL_QUERY_NEIGHBORS_SWR = "GRAPHQL_QUERY_NEIGHBORS_SWR"
export const GRAPHQL_QUERY_FOLLOWEES_SWR = "GRAPHQL_QUERY_FOLLOWEES_SWR"
export const GRAPHQL_QUERY_USER_SWR = "GRAPHQL_QUERY_USER_SWR"
export const GRAPHQL_QUERY_STATIC_SWR = "GRAPHQL_QUERY_STATIC_SWR"
export const GRAPHQL_QUERY_PLACED_ITEMS_SWR_MUTATION = "GRAPHQL_QUERY_PLACED_ITEMS_SWR_MUTATION"
export const GRAPHQL_QUERY_INVENTORIES_SWR = "GRAPHQL_QUERY_INVENTORIES_SWR"

// =====================================
// SPECIAL PURPOSE HOOKS
// =====================================
export const HONEYCOMB_SEND_TRANSACTION_SWR_MUTATION = "HONEYCOMB_SEND_TRANSACTION_SWR_MUTATION"
export const TRANSFER_TOKEN_SWR_MUTATION = "TRANSFER_TOKEN_SWR_MUTATION"
export const MUTATION_GRAPHQL_AUTHENTICATION_SWR_MUTATION = "MUTATION_GRAPHQL_AUTHENTICATION_SWR_MUTATION"

// =====================================
// IO CONSTANTS
// =====================================
export const GAMEPLAY_IO = "GAMEPLAY_IO"

// =====================================
// ASSET URL CONSTANTS
// =====================================
export const EXPERIENCE_IMAGE_URL = "/assets/ui/common/experience.png"
export const TOKEN_IMAGE_URL = "/assets/ui/common/icon-carrot.png"
export const GOLD_IMAGE_URL = "/assets/ui/common/icon-coin.png"
export const CHECK_IMAGE_URL = "/assets/ui/common/check.png"

// =====================================
// BACKWARD COMPATIBILITY CONSTANTS
// =====================================

// For backward compatibility (QUERY_ -> GRAPHQL_QUERY_)
export const QUERY_USER_SWR_MUTATION = GRAPHQL_QUERY_USER_SWR
export const QUERY_STATIC_SWR_MUTATION = GRAPHQL_QUERY_STATIC_SWR
export const QUERY_INVENTORIES_SWR_MUTATION = GRAPHQL_QUERY_INVENTORIES_SWR
export const QUERY_NEIGHBORS_SWR_MUTATION = GRAPHQL_QUERY_NEIGHBORS_SWR
export const QUERY_FOLLOWEES_SWR_MUTATION = GRAPHQL_QUERY_FOLLOWEES_SWR
export const QUERY_PLACED_ITEMS_SWR_MUTATION = GRAPHQL_QUERY_PLACED_ITEMS_SWR_MUTATION

// For backward compatibility (QUERY_GRAPHQL_ -> GRAPHQL_QUERY_)
export const QUERY_GRAPHQL_USER_SWR_MUTATION = GRAPHQL_QUERY_USER_SWR
export const QUERY_GRAPHQL_STATIC_SWR_MUTATION = GRAPHQL_QUERY_STATIC_SWR
export const QUERY_GRAPHQL_INVENTORIES_SWR_MUTATION = GRAPHQL_QUERY_INVENTORIES_SWR
export const QUERY_GRAPHQL_NEIGHBORS_SWR_MUTATION = GRAPHQL_QUERY_NEIGHBORS_SWR
export const QUERY_GRAPHQL_FOLLOWEES_SWR_MUTATION = GRAPHQL_QUERY_FOLLOWEES_SWR
export const QUERY_GRAPHQL_PLACED_ITEMS_SWR_MUTATION = GRAPHQL_QUERY_PLACED_ITEMS_SWR_MUTATION

// For backward compatibility (API_ -> GRAPHQL_MUTATION_)
export const API_AUTHENTICATION_SWR_MUTATION = GRAPHQL_MUTATION_AUTHENTICATION_SWR_MUTATION
export const API_UPDATE_TUTORIAL_SWR_MUTATION = GRAPHQL_MUTATION_UPDATE_TUTORIAL_SWR_MUTATION
export const API_CLAIM_DAILY_REWARD_SWR_MUTATION = GRAPHQL_MUTATION_CLAIM_DAILY_REWARD_SWR_MUTATION
export const API_CLAIM_HONEYCOMB_DAILY_REWARD_SWR_MUTATION = GRAPHQL_MUTATION_CLAIM_HONEYCOMB_DAILY_REWARD_SWR_MUTATION
export const API_MINT_OFFCHAIN_TOKENS_SWR_MUTATION = GRAPHQL_MUTATION_MINT_OFFCHAIN_TOKENS_SWR_MUTATION
export const API_HELP_FEED_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_HELP_FEED_ANIMAL_SWR_MUTATION
export const API_HARVEST_FRUIT_SWR_MUTATION = GRAPHQL_MUTATION_HARVEST_FRUIT_SWR_MUTATION
export const API_THIEF_FRUIT_SWR_MUTATION = GRAPHQL_MUTATION_THIEF_FRUIT_SWR_MUTATION
export const API_USE_BUG_NET_SWR_MUTATION = GRAPHQL_MUTATION_USE_BUG_NET_SWR_MUTATION
export const API_HELP_USE_BUG_NET_SWR_MUTATION = GRAPHQL_MUTATION_HELP_USE_BUG_NET_SWR_MUTATION
export const API_USE_FRUIT_FERTILIZER_SWR_MUTATION = GRAPHQL_MUTATION_USE_FRUIT_FERTILIZER_SWR_MUTATION
export const API_HELP_USE_FRUIT_FERTILIZER_SWR_MUTATION = GRAPHQL_MUTATION_HELP_USE_FRUIT_FERTILIZER_SWR_MUTATION
export const API_SPIN_SWR_MUTATION = GRAPHQL_MUTATION_SPIN_SWR_MUTATION
export const API_UPGRADE_BUILDING_SWR_MUTATION = GRAPHQL_MUTATION_UPGRADE_BUILDING_SWR_MUTATION
export const API_HELP_CURE_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_HELP_CURE_ANIMAL_SWR_MUTATION
export const API_HELP_USE_HERBICIDE_SWR_MUTATION = GRAPHQL_MUTATION_HELP_USE_HERBICIDE_SWR_MUTATION
export const API_HELP_USE_PESTICIDE_SWR_MUTATION = GRAPHQL_MUTATION_HELP_USE_PESTICIDE_SWR_MUTATION
export const API_HELP_WATER_CROP_SWR_MUTATION = GRAPHQL_MUTATION_HELP_WATER_CROP_SWR_MUTATION
export const API_COLLECT_ANIMAL_PRODUCT_SWR_MUTATION = GRAPHQL_MUTATION_COLLECT_ANIMAL_PRODUCT_SWR_MUTATION
export const API_CURE_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_CURE_ANIMAL_SWR_MUTATION
export const API_FEED_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_FEED_ANIMAL_SWR_MUTATION
export const API_HARVEST_CROP_SWR_MUTATION = GRAPHQL_MUTATION_HARVEST_CROP_SWR_MUTATION
export const API_PLANT_SEED_SWR_MUTATION = GRAPHQL_MUTATION_PLANT_SEED_SWR_MUTATION
export const API_USE_FERTILIZER_SWR_MUTATION = GRAPHQL_MUTATION_USE_FERTILIZER_SWR_MUTATION
export const API_USE_HERBICIDE_SWR_MUTATION = GRAPHQL_MUTATION_USE_HERBICIDE_SWR_MUTATION
export const API_USE_PESTICIDE_SWR_MUTATION = GRAPHQL_MUTATION_USE_PESTICIDE_SWR_MUTATION
export const API_WATER_CROP_SWR_MUTATION = GRAPHQL_MUTATION_WATER_CROP_SWR_MUTATION
export const API_HARVEST_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_HARVEST_ANIMAL_SWR_MUTATION
export const API_DELIVER_PRODUCT_SWR_MUTATION = GRAPHQL_MUTATION_DELIVER_PRODUCT_SWR_MUTATION
export const API_DELIVER_MORE_PRODUCT_SWR_MUTATION = GRAPHQL_MUTATION_DELIVER_MORE_PRODUCT_SWR_MUTATION
export const API_RETAIN_PRODUCT_SWR_MUTATION = GRAPHQL_MUTATION_RETAIN_PRODUCT_SWR_MUTATION
export const API_MOVE_SWR_MUTATION = GRAPHQL_MUTATION_MOVE_SWR_MUTATION
export const API_SELL_SWR_MUTATION = GRAPHQL_MUTATION_SELL_SWR_MUTATION
export const API_BUY_SEEDS_SWR_MUTATION = GRAPHQL_MUTATION_BUY_SEEDS_SWR_MUTATION
export const API_BUY_SUPPLIES_SWR_MUTATION = GRAPHQL_MUTATION_BUY_SUPPLIES_SWR_MUTATION
export const API_UPDATE_INVENTORY_INDEX_SWR_MUTATION = GRAPHQL_MUTATION_UPDATE_INVENTORY_INDEX_SWR_MUTATION
export const API_BUY_BUILDING_SWR_MUTATION = GRAPHQL_MUTATION_BUY_BUILDING_SWR_MUTATION
export const API_BUY_TILE_SWR_MUTATION = GRAPHQL_MUTATION_BUY_TILE_SWR_MUTATION
export const API_BUY_ANIMAL_SWR_MUTATION = GRAPHQL_MUTATION_BUY_ANIMAL_SWR_MUTATION
export const API_MOVE_INVENTORY_SWR_MUTATION = GRAPHQL_MUTATION_MOVE_INVENTORY_SWR_MUTATION
export const API_BUY_TOOL_SWR_MUTATION = GRAPHQL_MUTATION_BUY_TOOL_SWR_MUTATION
export const API_FOLLOW_SWR_MUTATION = GRAPHQL_MUTATION_FOLLOW_SWR_MUTATION
export const API_UNFOLLOW_SWR_MUTATION = GRAPHQL_MUTATION_UNFOLLOW_SWR_MUTATION
export const API_VISIT_SWR_MUTATION = GRAPHQL_MUTATION_VISIT_SWR_MUTATION
export const API_RETURN_SWR_MUTATION = GRAPHQL_MUTATION_RETURN_SWR_MUTATION
export const API_THIEF_CROP_SWR_MUTATION = GRAPHQL_MUTATION_THIEF_CROP_SWR_MUTATION
export const API_THIEF_ANIMAL_PRODUCT_SWR_MUTATION = GRAPHQL_MUTATION_THIEF_ANIMAL_PRODUCT_SWR_MUTATION
export const API_UPDATE_REFERRAL_SWR_MUTATION = GRAPHQL_MUTATION_UPDATE_REFERRAL_SWR_MUTATION
export const API_UPDATE_FOLLOW_X_SWR_MUTATION = GRAPHQL_MUTATION_UPDATE_FOLLOW_X_SWR_MUTATION
export const API_BUY_FRUIT_SWR_MUTATION = GRAPHQL_MUTATION_BUY_FRUIT_SWR_MUTATION