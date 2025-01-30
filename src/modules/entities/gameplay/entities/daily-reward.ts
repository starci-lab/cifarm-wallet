export interface DailyRewardEntity {
    id: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    golds?: number
    tokens?: number
    day: number
    lastDay: boolean
}