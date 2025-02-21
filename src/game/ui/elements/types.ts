export interface SetBoundsParams {
    min?: number
    max?: number
}

export interface UpdateValueParams {
    intValue: number
    onChange: (value: number) => void
}