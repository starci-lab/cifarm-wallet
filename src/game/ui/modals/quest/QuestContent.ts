import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { BaseAssetKey } from "../../../assets"
import { ProgressBar } from "../../loading"
import { ContainerLiteBaseConstructorParams } from "../../../types"
import { BaseText, ModalBackground } from "../../elements"

export class QuestContent extends ContainerLite {
    private background: ModalBackground
    constructor({ scene, x, y, width, height, children }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)

        // create the quest background
        this.createInviteUserItemCard()
    }
    // create the item card
    private createInviteUserItemCard() {
        const content = this.scene.add.container(this.x, this.y)
        //create the progress bar
        const progressBar = new ProgressBar({
            baseParams: {
                scene: this.scene,
            },
            options: {
                progress: 0.5,
            }
        }).setScale(1.2, 1.2)
        this.scene.add.existing(progressBar)
        content.add(progressBar)

        // create text
        const text = new BaseText({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 20,
                text: "10/20 users invited",
            },
            options: {
                fontSize: 20,
                enableStroke: true,
            },
        })
        this.scene.add.existing(text)
        content.add(text)

        // create the item card
        const itemCard = this.createItemCard({
            title: "Invite User",
            onPress: () => {
                console.log("Invite User")
            },
            content: content,
            contentPosition: {
                x: - 250,
                y: 20,
            }
        })
    }

    // create the item card
    private createItemCard({ title, content, contentPosition }: CreateItemCardParams) {
    // create card container
        const backgroundContainer = this.scene.add.container(0, 0)
        // create card item image
        const backgroundImage = this.scene.add.image(
            0,
            0,
            BaseAssetKey.UIModalQuestCardItem
        )
        // update the position of the card item image
        backgroundImage
            .setPosition(-backgroundImage.width * 0.5, -backgroundImage.height * 0.5)
            .setOrigin(0, 0)
        backgroundContainer.add(backgroundImage)
        // create the pin
        const pin = this.scene.add
            .image(0, 0, BaseAssetKey.UIModalQuestPin)
            .setPosition(backgroundImage.x - 15, backgroundImage.y - 15)
            .setOrigin(0, 0)
        backgroundContainer.add(pin)
        // create title
        const cardTitleImage = this.scene.add.image(0, 0, BaseAssetKey.UIModalQuestCardTitle)
        const titleText = new BaseText({
            baseParams: {
                scene: this.scene,
                x: 0,
                y: 0,
                text: title,
            },
            options: {
                fontSize: 32,
                enableStroke: true,
            },
        })
        this.scene.add.existing(titleText)
        const titleLabel = this.scene.rexUI.add.label({
            x: - backgroundImage.width / 2 + 40,
            y: - backgroundImage.height / 2 - 30,
            originX: 0,
            originY: 0,
            background: cardTitleImage,
            width: cardTitleImage.width,
            height: cardTitleImage.height,
            text: titleText,
            align: "center",
        }).layout()
        backgroundContainer.add(titleLabel)
        // create the card item  wrapper
        const wrapperBackgroundContainer = this.scene.add.container(
            0,
            0,
            backgroundContainer.setPosition(
                - backgroundContainer.width / 2,
                - backgroundContainer.height / 2
            )
        )
        
        // create the card item
        const cardItem = this.scene.rexUI.add.sizer({
            x: this.x,
            y: this.y,
            width: backgroundImage.width,
            height: backgroundImage.height,
        }).addBackground(wrapperBackgroundContainer).layout()
        // add the content
        if (content) {
            const x = this.x + (contentPosition?.x ?? 0)
            const y = this.y + (contentPosition?.y ?? 0)
            content.setDepth(1).setPosition(x, y)
            cardItem.add(content)
        }
        // add the container to the scene
        this.add(cardItem)
        return cardItem
    }
}

interface CreateItemCardParams {
  // onclick callback
  onPress: () => void;
  // quest title
  title: string;
  // content
  content?: Phaser.GameObjects.Container
  // content position
  contentPosition?: Phaser.Types.Math.Vector2Like
}
