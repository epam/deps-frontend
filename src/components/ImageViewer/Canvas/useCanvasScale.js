
import { useCallback, useEffect } from 'react'

const useCanvasScale = ({
  context,
  imageScaleToApply,
  position,
  scaleConfig,
  setPosition,
  isScaleToPointEnabled,
}) => {
  const scale = useCallback(() => {
    const scaleFactor = scaleConfig?.value
    scaleFactor && context.scale(scaleFactor, scaleFactor)
    context.scale(imageScaleToApply, imageScaleToApply)
  }, [
    context,
    imageScaleToApply,
    scaleConfig?.value,
  ])

  useEffect(() => {
    if (!scaleConfig) {
      return
    }

    const scaleOnWheel = (e) => {
      e.preventDefault()

      const {
        max: maxScale,
        min: minScale,
        value: oldScale,
        step: scaleStep,
        onChange: onScaleChange,
      } = scaleConfig
      const deltaScale = e.deltaY > 0 ? -scaleStep : scaleStep
      const newScale = Math.min(
        maxScale,
        Math.max(minScale, oldScale + deltaScale),
      )

      if (isScaleToPointEnabled) {
        const rect = context.canvas.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const dx = mouseX - position.x
        const dy = mouseY - position.y

        setPosition({
          x: mouseX - (dx * newScale) / oldScale,
          y: mouseY - (dy * newScale) / oldScale,
        })
      }

      onScaleChange(newScale)
    }

    context?.canvas.addEventListener('wheel', scaleOnWheel, {
      passive: false,
    })

    return () => context?.canvas.removeEventListener('wheel', scaleOnWheel, {
      passive: false,
    })
  }, [
    context,
    position,
    scaleConfig,
    setPosition,
    isScaleToPointEnabled,
  ])

  return { scale }
}

export {
  useCanvasScale,
}
