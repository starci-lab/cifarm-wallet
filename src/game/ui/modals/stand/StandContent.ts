import { BaseAssetKey } from "@/game/assets"
import { ContainerLiteBaseConstructorParams } from "@/game/types"
import { DeliveringProductEntity } from "@/modules/entities"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"
import { GridTable } from "phaser3-rex-plugins/templates/ui/ui-components"

export class StandContent extends ContainerLite {
    private gridTable: GridTable | undefined
    private deliveringProduct: Array<DeliveringProductEntity> = []

    constructor({ scene, x, y, width, height, children }: ContainerLiteBaseConstructorParams) {
        super(scene, x, y, width, height, children)
        this.createStandGrid()
    }

    private createStandGrid() {
        const gridWidth = 800 // Fixed width
        const gridHeight = 800 // Fixed height

        // Sample Item Data
        const itemList = [
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Wheat Seed", onPress: () => console.log("Clicked on Wheat Seed") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Corn Seed", onPress: () => console.log("Clicked on Corn Seed") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Rice Seed", onPress: () => console.log("Clicked on Rice Seed") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Apple", onPress: () => console.log("Clicked on Apple") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Orange", onPress: () => console.log("Clicked on Orange") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Banana", onPress: () => console.log("Clicked on Banana") },
            { assetKey: BaseAssetKey.ModalInventoryIconProduct, title: "Grapes", onPress: () => console.log("Clicked on Grapes") },
        ]

        // Create Fixed Grid Table
        this.gridTable = this.scene.rexUI.add.gridTable({
            x: 0,
            y: 0,
            width: gridWidth,
            height: gridHeight,
            background: this.scene.add.rectangle(0, 0, gridWidth, gridHeight, 0x222222, 0),
            table: {
                columns: 3, // Fixed 3 columns
                cellWidth: 300, // Fixed cell size
                cellHeight: 300, // Fixed cell size
                mask: false, // Disable scroll/masking
                interactive: false // No user interaction with table scrolling
            },
            space: {
                left: 20, right: 20, top: 20, bottom: 20, table: 20
            },
            createCellContainerCallback: (cell) => {
                return this.createItemCard(itemList[cell.index])
            },
            items: itemList,
        }).layout().setOrigin(0.5, 0.5)

        this.addLocal(this.gridTable)
    }

    private createItemCard({ assetKey, title, onPress }: CreateItemCardParams) {
        // Shadow (Behind the icon)
        const shadow = this.scene.add.image(0, 0, BaseAssetKey.ModalStandShadow)
            .setPosition(0, 0)
            .setOrigin(0.5, 0.5)
            .setScale(1) 
    
        // Icon
        const icon = this.scene.add.image(0, 0, assetKey)
            .setOrigin(1, 1)
            .setScale(2)
    
        // Tag (Below the icon)
        const tag = this.scene.add.image(0, 0, BaseAssetKey.ModalStandTag)
            .setOrigin(0.5, 0)
            .setScale(1)
    
        // Create a container that wraps all elements
        const container = this.scene.rexUI.add.sizer({
            width: 150,
            height: 180, // Adjust height to accommodate tag
            orientation: "vertical",
            space: { item: 10 }
        })
            .add(shadow, { align: "center", expand: false,
                offsetY: 170,
            }) // Shadow behind
            .add(icon, { align: "center" }) // Icon in center
            .add(tag, { align: "center", expand: false, padding: { top: 5 } }) // Tag below icon
            .setInteractive() // Make the whole container interactive
            .on("pointerdown", () => {
                onPress()
            })
    
        return container
    }
    
    
}

export interface CreateItemCardParams {
    assetKey: string;
    title: string;
    onPress: () => void;
}
