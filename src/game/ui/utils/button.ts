import { SCALE_PEAK_VALUE, SCALE_TIME } from "@/game/constants"

const tweenMap = new Map<Phaser.GameObjects.GameObject, Phaser.Tweens.Tween>()

export interface OnGameObjectClickParams {
  gameObject: Phaser.GameObjects.GameObject;
  onClick: () => void;
  animate?: boolean;
  scene: Phaser.Scene;
  peakValue?: number;
  disableInteraction?: boolean;
}

export const onGameObjectClick = ({
    gameObject,
    onClick,
    animate = true,
    scene,
    peakValue = SCALE_PEAK_VALUE,
    disableInteraction = true,
}: OnGameObjectClickParams) => {
    // Disable interaction
    if (disableInteraction && gameObject.input) {
        gameObject.input.enabled = false
    }

    // Apply scaling animation if animate is true
    if (animate) {
        const processTween = () => {
            const foundTween = tweenMap.get(gameObject)
            if (foundTween) {
                if (!foundTween.isDestroyed()) {
                    foundTween.seek(SCALE_TIME / 4)
                    return
                }
            }
            const tween = scene.tweens.add({
                targets: gameObject,
                scaleX: peakValue,
                scaleY: peakValue,
                duration: SCALE_TIME,
                yoyo: true,
                ease: "Sine.easeInOut",
            })
            tweenMap.set(gameObject, tween)
        }
        processTween()
    }

    // Wait for the animation to finish, then re-enable interaction
    if (disableInteraction) {
        scene.time.delayedCall(SCALE_TIME, () => {
            if (gameObject.input) {
                gameObject.input.enabled = true
            }
        })
    }

    // Call the onClick function
    onClick()
}
