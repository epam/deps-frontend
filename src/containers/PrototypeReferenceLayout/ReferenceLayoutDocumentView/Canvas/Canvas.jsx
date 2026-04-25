
import PropTypes from 'prop-types'
import { useMemo, useRef, useState } from 'react'
import {
  Stage,
  Layer,
  Image,
  Line,
  Group,
} from 'react-konva/lib/ReactKonvaCore'
import 'konva/lib/shapes/Image'
import 'konva/lib/shapes/Line'
import { Spin } from '@/components/Spin'
import { Cursor } from '@/enums/Cursor'
import { useImageLoader } from '@/hooks/useImageLoader'
import { Point } from '@/models/Point'
import { ENV } from '@/utils/env'
import { canvasImageShape } from './CanvasImage'
import { canvasLineShape } from './CanvasLine'
import { canvasScaleConfigShape } from './CanvasScaleConfig'

const getLinePoints = (coords, width, height) => (
  coords
    .map(({ x, y }) => (
      new Point(
        x * width,
        y * height,
      )))
    .flatMap((c) => Object.values(c))
)

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 200

const Canvas = ({
  imageUrl,
  lines,
  images,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  onStageClick,
  cursor = Cursor.GRAB,
  scaleConfig,
  renderExtra,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const stageRef = useRef()
  const canvasRatio = height / width

  const { image, isLoading } = useImageLoader(imageUrl, ENV.FEATURE_FILE_CACHE)

  const imageRatio = image.height / image.width
  const imageScaleToApply = (
    canvasRatio > imageRatio
      ? height / image.height
      : width / image.width
  )

  const drawnImageWidth = image.width * imageScaleToApply || image.width
  const drawnImageHeight = image.height * imageScaleToApply || image.height

  const getBoundedPosition = ({ x, y }) => {
    const imageWidth = drawnImageWidth * scaleConfig.value
    const imageHeight = drawnImageHeight * scaleConfig.value
    const isFitHorizontally = imageWidth <= width
    const isFitVertically = imageHeight <= height

    let xMin = 0
    let xMax = width - imageWidth
    let yMin = 0
    let yMax = height - imageHeight

    if (!isFitHorizontally) {
      [xMin, xMax] = [xMax, xMin]
    }

    if (!isFitVertically) {
      [yMin, yMax] = [yMax, yMin]
    }

    return {
      x: Math.max(xMin, Math.min(x, xMax)),
      y: Math.max(yMin, Math.min(y, yMax)),
    }
  }

  const handleWheel = ({ evt }) => {
    evt.preventDefault()

    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const { min, max, step, onChange } = scaleConfig
    const scale = evt.deltaY < 0 ? oldScale + step : oldScale - step
    const newScale = Math.min(max, Math.max(min, scale))

    onChange(newScale)
  }

  const handleDragStart = () => {
    setIsDragging(true)
    const stage = stageRef.current
    const container = stage.container()
    container.style.cursor = Cursor.GRABBING
  }

  const handleDragEnd = () => {
    const stage = stageRef.current
    const container = stage.container()
    container.style.cursor = Cursor.GRAB
    setIsDragging(false)
  }

  const Lines = useMemo(() => (
    lines?.map(({ coords, ...rest }, idx) => {
      const points = getLinePoints(coords, drawnImageWidth, drawnImageHeight)
      return (
        <Line
          key={idx}
          points={points}
          {...rest}
        />
      )
    })
  ), [
    lines,
    drawnImageWidth,
    drawnImageHeight,
  ])

  const Images = useMemo(() => (
    images?.map(({ x, y, ...rest }, i) => (
      <Image
        key={i}
        x={x * drawnImageWidth}
        y={y * drawnImageHeight}
        {...rest}
      />
    ))
  ), [
    drawnImageWidth,
    drawnImageHeight,
    images,
  ])

  if (isLoading) {
    return <Spin.Centered spinning />
  }

  return (
    <>
      <Stage
        ref={stageRef}
        height={height}
        onClick={onStageClick}
        onWheel={handleWheel}
        scale={
          {
            x: scaleConfig.value,
            y: scaleConfig.value,
          }
        }
        style={{ cursor }}
        width={width}
      >
        <Layer>
          <Group
            dragBoundFunc={getBoundedPosition}
            draggable
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <Image
              height={drawnImageHeight}
              image={image.resource}
              width={drawnImageWidth}
            />
            { Lines }
            { Images }
          </Group>
        </Layer>
      </Stage>
      {renderExtra?.(isDragging)}
    </>
  )
}

Canvas.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  lines: PropTypes.arrayOf(canvasLineShape),
  images: PropTypes.arrayOf(canvasImageShape),
  scaleConfig: canvasScaleConfigShape.isRequired,
  cursor: PropTypes.oneOf(
    Object.values(Cursor),
  ),
  onStageClick: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  renderExtra: PropTypes.func,
}

export {
  Canvas,
}
