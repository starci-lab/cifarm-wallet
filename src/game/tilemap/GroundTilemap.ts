import { WIDTH, HEIGHT, TILE_WIDTH, TILE_HEIGHT, GRASS_GID, SCALE } from "./constants"
import { BaseTilemap } from "./BaseTilemap"
import { LayerName, TilesetName } from "./types"
import { BaseAssetKey } from "../assets"
import { TilemapBaseConstructorParams } from "../types"

export class GroundTilemap extends BaseTilemap {
    // create the ground layer
    protected groundLayer: Phaser.Tilemaps.TilemapLayer

    // constructor
    constructor(baseParams: TilemapBaseConstructorParams) {
        super({
            baseParams,
            options: {
                width: WIDTH,
                height: HEIGHT,
                tileWidth: TILE_WIDTH,
                tileHeight: TILE_HEIGHT,
                objectLayerNames: [LayerName.Item],
                scale: SCALE,
            }
        })

        // set the ground layer
        this.groundLayer = this.createGroundLayer()
    }

    // create the ground layer
    private createGroundLayer() {
        // create the ground layer
        const grassTileset = this.createSingleTileTileset({
            tilesetName: TilesetName.Grass,
            key: BaseAssetKey.Grass,
            gid: GRASS_GID,
        })
        
        // create ground layer
        const groundLayer = this.createBlankLayer(LayerName.Ground, grassTileset)
        if (!groundLayer) {
            throw new Error("Layer not found")
        }
        
        // fill the layer with random tiles
        groundLayer.randomize(0, 0, this.width, this.height, [0])
        
        // scale the layer
        groundLayer.setScale(this.scale)
        
        // return the layer
        return groundLayer
    }
}