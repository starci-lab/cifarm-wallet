import { Buttons, NinePatch2, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components"

// base constructor params for Text
export interface TextBaseConstructorParams {
    scene: Phaser.Scene
    x: number
    y: number
    text: string
    // optional style
    style?: Phaser.Types.GameObjects.Text.TextStyle
}

// base constructor params for NinePatch2
export interface NinePatch2BaseConstructorParams {
    scene: Phaser.Scene, 
    config?: NinePatch2.IConfig
}

// base constructor params for Container
export interface ContainerBaseConstructorParams {
    scene: Phaser.Scene
    x: number
    y: number
}

// base constructor params for Button
export interface HorizontalButtonBaseConstructorParams {
    scene: Phaser.Scene
    config?: Buttons.IConfig
}

// base constructor params for Sizer
export interface SizerBaseConstructorParams {
    scene: Phaser.Scene
    x?: number
    y?: number
    width?: number
    height?: number
    config?: Sizer.IConfig
}

// interface for constructor params
export interface ConstructorParams<TBaseConstructorParams, TOptions> {
    baseParams: TBaseConstructorParams
    options: TOptions
}