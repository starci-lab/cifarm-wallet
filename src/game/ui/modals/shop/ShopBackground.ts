import { BaseAssetKey } from "../../../assets"
import { ContainerBaseConstructorParams } from "../../../types"

export class ShopBackground extends Phaser.GameObjects.Container {
    private wall: Phaser.GameObjects.Image | undefined
    private bottomBar: Phaser.GameObjects.Image | undefined
    private bottomDecorator: Phaser.GameObjects.Image | undefined

    constructor({ scene, x, y }: ContainerBaseConstructorParams) {
        super(scene, x, y)

        this.wall = this.scene.add
            .image(0, -170, BaseAssetKey.ModalShopWall)
            .setOrigin(0.5, 1)
        this.add(this.wall)

        this.bottomBar = this.scene.add
            .image(0, 0, BaseAssetKey.ModalShopBottomBar)
            .setOrigin(0.5, 1)
        this.add(this.bottomBar)

        this.bottomDecorator = this.scene.add
            .image(0, 0, BaseAssetKey.ModalShopBottomDecorator)
            .setOrigin(0.5, 1)
        this.add(this.bottomDecorator)
    }
}