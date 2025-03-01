import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { ContainerLiteBaseConstructorParams } from "../../../types"
import { Background, ModalBackground } from "../../elements"
import { EventBus, EventName, ModalName } from "@/game/event-bus"
import { QuestTab } from "./types"
import { tabsConfig } from "./constants"
import { SocialTab } from "./SocialTab"

const defaultTab = QuestTab.Social
export class QuestContent extends ContainerLite {
    private background: ModalBackground
    private socialTab: SocialTab
    //private background: ModalBackground
    constructor({
        scene,
        x,
        y,
        width,
        height,
        children,
    }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)
        // create the modal background
        this.background = new ModalBackground({
            baseParams: {
                scene,
                children,
            },
            options: {
                background: Background.XXLarge,
                tabs: {
                    options: {
                        tabs: Object.values(QuestTab).map((tab) => ({
                            tabKey: tab,
                            iconKey: tabsConfig[tab].iconKey,
                            scale: tabsConfig[tab].scale,
                            offsets: tabsConfig[tab].offsets,
                        })),
                        name: QuestTab.Social,
                        defaultTab
                    },
                    width: 750,
                },
                title: "Quests",
                onXButtonPress: () => {
                    EventBus.emit(EventName.CloseModal, {
                        modalName: ModalName.Quest,
                    })
                },
                container: {
                    showContainer: false,
                    showWrapperContainer: true,
                },
            },
        })
        this.scene.add.existing(this.background)
        this.addLocal(this.background)

        // create the base tab
        this.socialTab = new SocialTab({
            scene: this.scene,
            width: 750,
            height: 800,
        })
        this.scene.add.existing(this.socialTab)
        if (!this.background.container) {
            throw new Error("QuestContent requires a container")
        }
        this.background.container.addLocal(this.socialTab)
    }
}

