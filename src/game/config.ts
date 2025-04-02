import { AUTO, Game } from "phaser"
import { BootstrapScene, LoadingScene, GameplayScene, UIScene, SoundScene, DataScene } from "./scenes"
import { CONTAINER_ID } from "./constants"
import GesturesPlugin from "phaser3-rex-plugins/plugins/gestures-plugin.js"
import MouseWheelScrollerPlugin from "phaser3-rex-plugins/plugins/mousewheelscroller-plugin.js"
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js"
import { UserSchema } from "@/modules/entities"
import { SpinePlugin } from "@esotericsoftware/spine-phaser"
import AwaitLoaderPlugin from "phaser3-rex-plugins/plugins/awaitloader-plugin.js"

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    parent: CONTAINER_ID,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1920,
    },
    autoMobilePipeline: true,
    powerPreference: "high-performance",
    dom: {
        createContainer: true
    },
    plugins: {
        global: [{
            key: "rexAwaitLoader",
            plugin: AwaitLoaderPlugin,
            start: true
        },
        // ...
        // ...
        ],
        scene: [
            //add rexGestures plugin
            {
                key: "rexGestures",
                plugin: GesturesPlugin,
                mapping: "rexGestures",
            },
            //add MouseWheelScroller plugin
            {
                key: "rexMouseWheelScroller",
                plugin: MouseWheelScrollerPlugin,
                mapping: "rexMouseWheelScroller",
            },
            //add UI plugin
            {
                key: "rexUI",
                plugin: UIPlugin,
                mapping: "rexUI",
            },
            //add Spine plugin
            { key: "spine.SpinePlugin", plugin: SpinePlugin, mapping: "spine" },
        ],
    },
    scene: [BootstrapScene, SoundScene, LoadingScene, GameplayScene, UIScene, DataScene],
}

export const startGame = (parent?: string) => {
    if (parent) {
        config.parent = parent
    }
    return new Game(config)
}

export interface GameData {
    watchingUser?: UserSchema
}
export interface GameState {
    data?: GameData
}

export const gameState: GameState = {}