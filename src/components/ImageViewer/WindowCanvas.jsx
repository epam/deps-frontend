
import PropTypes from 'prop-types'
import {
  useState,
  useEffect,
  useCallback,
} from 'react'
import { Cursor } from '@/enums/Cursor'
import { useWindowSize } from '@/hooks/useWindowSize'
import { FileCache } from '@/services/FileCache'
import { ENV } from '@/utils/env'
import { loadImageURL } from '@/utils/image'
import { Canvas } from './Canvas'
import { ImgWrapper } from './ImageViewer.styles'

const MODAL_WIDTH = 0.9
const MODAL_PADDING = 24

const WindowCanvas = (props) => {
  const [sizes, setSizes] = useState(null)

  const { width: windowWidth } = useWindowSize()

  const loadImage = useCallback(async (imageUrl) => {
    if (!ENV.FEATURE_FILE_CACHE) {
      return loadImageURL(imageUrl)
    }

    const cachedBlob = await FileCache.get(imageUrl)
    const url = cachedBlob ? URL.createObjectURL(cachedBlob) : imageUrl

    return loadImageURL(url)
  }, [])

  useEffect(() => {
    loadImage(props.imageUrl)
      .then((image) => {
        setSizes({
          width: image.width,
          height: image.height,
        })
      })
  }, [props.imageUrl, loadImage])

  if (!sizes) {
    return null
  }

  const ratio = sizes.height === 0 ? 1 : sizes.width / sizes.height
  const viewerWidth = windowWidth * MODAL_WIDTH - MODAL_PADDING * 2
  const width = props.rotationAngle % 180 === 0 ? viewerWidth : viewerWidth * ratio
  const height = props.rotationAngle % 180 === 0 ? viewerWidth / ratio : viewerWidth / ratio * ratio

  return (
    <ImgWrapper>
      <Canvas
        cursor={Cursor.CROSSHAIR}
        height={height}
        width={width}
        {...props}
      />
    </ImgWrapper>
  )
}

WindowCanvas.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  rotationAngle: PropTypes.number,
}

export {
  WindowCanvas,
}
