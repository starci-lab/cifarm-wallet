import React, { FC, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    ExtendedButton,
    ModalHeader,
    Progress,
    Spacer,
} from "@/components"
import { useSingletonHook } from "@/modules/singleton-hook"
import { useDisclosure } from "react-use-disclosure"
import { DOWNLOADING_DISCLOSURE } from "@/app/constants"
import { assetFruitMap, assetProductMap, AssetTextureData } from "@/modules/assets"
import {
    addDownloadProgress,
    setTotalDownloadBytes,
    setDownloadCompleted,
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import { downloadTexture, getBytes } from "./download"
import { sessionDb } from "@/modules/dexie"
import bytes from "bytes"

export const DownloadingModal: FC = () => {
    const { toggle, isOpen } = useSingletonHook<ReturnType<typeof useDisclosure>>(
        DOWNLOADING_DISCLOSURE
    )
    const downloadPackageModal = useAppSelector(
        (state) => state.modalReducer.downloadPackageModal
    )

    const { downloadProgresses, totalDownloadBytes, downloadCompleted } =
    useAppSelector((state) => state.downloadReducer)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (!isOpen) return
        if (!downloadPackageModal.packageId) return
        const handleEffect = async () => {
            try {
                const textureDatas: Array<AssetTextureData> = []
                const fruitTextureDatas = Object.values(assetFruitMap)
                    .flatMap((fruit) =>
                        Object.values(fruit.phaser.map.stages).map((stage) => {
                            if (!stage.mapData) {
                                throw new Error("Texture data is undefined")
                            }
                            if (!stage.mapData.texture) {
                                throw new Error("Texture data is undefined")
                            }
                            return stage.mapData.texture
                        })
                    )
                    .filter(
                        (textureData) =>
                            textureData?.packageId === downloadPackageModal.packageId
                    )
                textureDatas.push(...fruitTextureDatas)
                const productTextureDatas = Object.values(assetProductMap)
                    .flatMap((product) =>
                        Object.values(product.phaser.base).map((stage) => {
                            if (!stage.mapData) {
                                throw new Error("Texture data is undefined")
                            }
                            if (!stage.mapData.texture) {
                                throw new Error("Texture data is undefined")
                            }
                            return stage.mapData.texture
                        })
                    ).filter(
                        (textureData) =>
                            textureData?.packageId === downloadPackageModal.packageId
                        && !textureData?.useExisting
                    )
                textureDatas.push(...productTextureDatas)
                const bytesMap = await getBytes(textureDatas)
                dispatch(setTotalDownloadBytes(bytesMap))
                for (const textureData of textureDatas) {
                    await downloadTexture(textureData, (key, data) => {
                        dispatch(addDownloadProgress({ key, data }))
                    })
                }
                await sessionDb.packages.add({
                    packageId: downloadPackageModal.packageId || 0,
                })
                dispatch(setDownloadCompleted(true))
            } catch (error) {
                console.error(error)
            }
        }
        handleEffect()
    }, [downloadPackageModal.packageId, isOpen])
    const downloadedBytes = Object.entries(downloadProgresses).reduce(
        (acc, [key, data]) => {
            const bytes = totalDownloadBytes[key]
            if (!bytes) return acc
            return acc + data.progress * bytes
        },
        0
    )
    const totalBytes = Object.values(totalDownloadBytes).reduce((acc, curr) => acc + curr, 0)
    return (
        <Dialog open={isOpen} onOpenChange={toggle}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <ModalHeader
                            title="Downloading"
                            description="Downloading the package..."
                        />
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Progress value={(downloadedBytes / totalBytes) * 100} />
                    <Spacer y={2} />
                    <div className="text-sm">
                        {`${bytes(downloadedBytes)} / ${bytes(totalBytes)}`}
                    </div>
                    {downloadCompleted && (
                        <>
                            <Spacer y={4} />
                            <div>
                                <div className="text-muted-foreground text-sm">
                                        Download completed. Please restart the game to see the
                                        changes.
                                </div>
                                <Spacer y={2} />
                                <ExtendedButton
                                    className="w-full"
                                    onClick={() => {
                                        window.location.reload()
                                    }}
                                >
                                        Restart
                                </ExtendedButton>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
