import { SceneAbstract } from "@/game/SceneAbstract"
import { Scene } from "phaser"
import { getScreenCenterX, getScreenTopY } from "../utils"
import { TopbarBackground } from "./TopbarBackground"
import { TopbarContent } from "./TopbarContent"

export class Topbar extends SceneAbstract {
    private topbarBackground: TopbarBackground
    private topbarContent: TopbarContent

    constructor(scene: Scene) {
        super(scene)

        const { width } = this.scene.scale

        // create the toolbar background
        this.topbarBackground = new TopbarBackground({
            scene: this.scene,
            x: getScreenCenterX(this.scene),
            y: getScreenTopY(this.scene) + 180,
            width,
            height: 180,
        })
        this.scene.add.existing(this.topbarBackground)

        this.topbarContent = new TopbarContent(this.scene)
    }
}
