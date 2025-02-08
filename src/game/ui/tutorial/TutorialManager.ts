import {
    CloseTutorialMessage,
    EventName,
    OpenTutorialMessage,
} from "../../event-bus"
import { BLACK_COLOR } from "../../constants"
import { CacheKey } from "../../types"
import { UserEntity } from "@/modules/entities"
import { tutorialStepMap } from "./config"
import { Stacy } from "./Stacy"
import { SceneAbstract } from "@/game/SceneAbstract"
import { Scene } from "phaser"

export class TutorialManager extends SceneAbstract {
    private backdrop: Phaser.GameObjects.Rectangle | undefined
    private user: UserEntity
    private stacy: Stacy

    constructor(scene: Scene) {
        super(scene)

        // get the user from the cache
        this.user = this.scene.cache.obj.get(CacheKey.User)

        // get the width and height of the game
        const { width, height } = this.scene.game.scale
        this.backdrop = this.scene.add
            .rectangle(this.centerX, this.centerY, width, height, BLACK_COLOR, 0.5)
            .setInteractive().setDepth(1)

        this.scene.events.on(
            EventName.OpenTutorial,
            (message: OpenTutorialMessage) => {
                this.onOpen(message)
            }
        )
        this.scene.events.on(
            EventName.CloseTutorial,
            (message: CloseTutorialMessage) => {
                this.onClose(message)
            }
        )
        // create Stacy
        this.stacy = new Stacy({
            scene: this.scene,
            x: width / 2,
            y: height / 2,
        })

        this.start()
    }

    //run on start
    private start() {
        const { lastOfThisPhase, message, phase } =
      tutorialStepMap[this.user.tutorialStep]
        // do nothing if the tutorial step is last of this phase
        if (lastOfThisPhase) return
        const eventMessage: OpenTutorialMessage = {
            tutorialStep: this.user.tutorialStep,
        }
        this.scene.events.emit(EventName.OpenTutorial, eventMessage)
        console.log(message, phase)
    }

    // open the tutorial
    private onOpen({ tutorialStep }: OnOpenParams) {
        if (!this.backdrop) {
            throw new Error("Backdrop not found")
        }
        this.backdrop.setActive(true).setVisible(true)

        this.stacy.show()
        this.stacy.render(tutorialStep)
    }

    // close the tutorial
    private onClose({ tutorialStep }: OnCloseParams) {
        if (!this.backdrop) {
            throw new Error("Backdrop not found")
        }
        this.backdrop.setActive(false).setVisible(false)
        this.stacy.hide()
    }
}

export type OnOpenParams = OpenTutorialMessage;
export type OnCloseParams = CloseTutorialMessage;
