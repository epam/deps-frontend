
import { useCallback } from 'react'
import { useImageLoader } from '@/hooks/useImageLoader'
import { ENV } from '@/utils/env'

const IMAGE_COORDS = {
  x: 0,
  y: 0,
}

const useCanvasImage = ({
  context,
  imageUrl,
}) => {
  const { image, isLoading } = useImageLoader(imageUrl, ENV.FEATURE_FILE_CACHE)

  const draw = useCallback(() => {
    context.drawImage(
      image.resource,
      IMAGE_COORDS.x,
      IMAGE_COORDS.y,
    )
  }, [
    context,
    image,
  ])

  return {
    draw,
    ...image,
    isLoading,
  }
}

export {
  useCanvasImage,
}
