
export interface ExtraOffsets {
  x?: number;
  y?: number;
}

export interface AtlasConfig {
  key: string;
  assetUrl: string;
}

export interface JsonConfig {
  key: string;
  assetUrl: string;
}

export interface SpineConfig {
  atlas: AtlasConfig;
  json: JsonConfig;
}

// interface for configuration of textures
export interface TextureConfig {
    key: string;
    assetUrl?: string;
    useExisting?: boolean;
    isQuality?: boolean;
    spineConfig?: SpineConfig;
    extraOffsets?: ExtraOffsets;
    scaleWidth?: number;
    scaleHeight?: number;
}

export interface ShopAssetData {
  textureConfig: TextureConfig;
}