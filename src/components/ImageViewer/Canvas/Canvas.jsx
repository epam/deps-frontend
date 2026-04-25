
import PropTypes from 'prop-types'
import {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Spin } from '@/components/Spin'
import { Cursor } from '@/enums/Cursor'
import { pointShape } from '@/models/Point'
import { ENV } from '@/utils/env'
import { useCanvasDragger } from './useCanvasDragger'
import { useCanvasImage } from './useCanvasImage'
import { useCanvasPolygons } from './useCanvasPolygons'
import { useCanvasScale } from './useCanvasScale'
import { useTranslationToView } from './useTranslationToView'

const CANVAS_CONTEXT_TYPE = '2d'
const INITIAL_POSITION = {
  x: 0,
  y: 0,
}
const DEFAULT_SCALE_FACTOR = 1

const Canvas = ({
  activePolygons,
  cursor = Cursor.GRAB,
  height = 200,
  imageUrl,
  onAddActivePolygons,
  onClearActivePolygons,
  polygons,
  rotationAngle = 0,
  scaleConfig,
  width = 200,
  scalingToPointFeature = false,
}) => {
  const canvasRef = useRef()
  const context = canvasRef.current?.getContext(CANVAS_CONTEXT_TYPE)
  const [position, setPosition] = useState(INITIAL_POSITION)
  const scaleFactor = scaleConfig?.value || DEFAULT_SCALE_FACTOR
  const isScaleToPointEnabled = ENV.FEATURE_SCALE_TO_POINT && scalingToPointFeature

  const image = useCanvasImage({
    context,
    imageUrl,
  })

  const imageScaleToApply = useMemo(() => {
    const canvasRatio = height / width
    const imageRatio = image.height / image.width

    return canvasRatio > imageRatio
      ? height / image.height
      : width / image.width
  }, [
    height,
    width,
    image,
  ])

  const drawnImageSize = useMemo(() => ({
    width: image.width * imageScaleToApply * scaleFactor,
    height: image.height * imageScaleToApply * scaleFactor,
  }), [
    image.width,
    image.height,
    imageScaleToApply,
    scaleFactor,
  ])

  const { drawPolygons } = useCanvasPolygons({
    context,
    polygons,
    activePolygons,
    onAddActivePolygons,
    onClearActivePolygons,
  })

  useTranslationToView({
    drawnImageSize,
    polygons,
    canvasWidth: width,
    canvasHeight: height,
    rotationAngle,
    position,
    setPosition,
  })

  const {
    dragCursor,
    dragProp,
  } = useCanvasDragger({
    context,
    canvasWidth: width,
    canvasHeight: height,
    drawnImageSize,
    rotationAngle,
    setPosition,
    isScaleToPointEnabled,
  })

  const { scale } = useCanvasScale({
    context,
    imageScaleToApply,
    position,
    scaleConfig,
    setPosition,
    isScaleToPointEnabled,
  })

  const rotate = useCallback(() => {
    const halfWidth = width / 2
    const halfHeight = height / 2
    const isVertical = rotationAngle % 180 === 0

    context.translate(halfWidth, halfHeight)
    context.rotate(rotationAngle * Math.PI / 180)

    if (isVertical) {
      context.translate(-halfWidth, -halfHeight)
      return
    }

    context.translate(-halfHeight, -halfWidth)
  }, [
    width,
    height,
    context,
    rotationAngle,
  ])

  const clearCanvas = useCallback(() => {
    context.clearRect(0, 0, width, height)
  }, [
    width,
    height,
    context,
  ])

  const renderWithScaleToPointFeature = useCallback(() => {
    const halfWidth = image.width / 2
    const halfHeight = image.height / 2
    const isVertical = rotationAngle % 180 === 0

    clearCanvas()
    context.save()
    context.translate(position.x, position.y)
    scale()

    context.translate(halfWidth, halfHeight)
    context.rotate(rotationAngle * Math.PI / 180)

    if (isVertical) {
      context.translate(-halfWidth, -halfHeight)
    } else {
      context.translate(-halfHeight, -halfWidth)
    }

    image.draw()
    polygons && drawPolygons(image.width, image.height)
    context.restore()
  }, [
    clearCanvas,
    context,
    drawPolygons,
    image,
    polygons,
    position,
    rotationAngle,
    scale,
  ])

  useEffect(() => {
    if (image.isLoading) {
      clearCanvas()
      return
    }

    const renderImageLayer = () => {
      if (isScaleToPointEnabled) {
        renderWithScaleToPointFeature()
        return
      }

      clearCanvas()
      context.save()
      context.translate(position.x, position.y)
      rotate()
      scale()
      image.draw()
      polygons && drawPolygons(image.width, image.height)
      context.restore()
    }

    image.resource && renderImageLayer()
  }, [
    clearCanvas,
    context,
    drawPolygons,
    image,
    polygons,
    position,
    renderWithScaleToPointFeature,
    rotate,
    scale,
    isScaleToPointEnabled,
  ])

  return (
    <Spin spinning={image.isLoading}>
      <canvas
        ref={canvasRef}
        height={height}
        role={'img'}
        style={
          {
            width,
            height,
            display: 'block',
            cursor: cursor === Cursor.GRAB ? dragCursor : cursor,
          }
        }
        width={width}
        {...dragProp}
      />
    </Spin>
  )
}

Canvas.propTypes = {
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  cursor: PropTypes.oneOf(
    Object.values(Cursor),
  ),
  height: PropTypes.number,
  imageUrl: PropTypes.string.isRequired,
  onAddActivePolygons: PropTypes.func,
  onClearActivePolygons: PropTypes.func,
  polygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  rotationAngle: PropTypes.number,
  scaleConfig: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  }),
  width: PropTypes.number,
  scalingToPointFeature: PropTypes.bool,
}

export {
  Canvas,
}
