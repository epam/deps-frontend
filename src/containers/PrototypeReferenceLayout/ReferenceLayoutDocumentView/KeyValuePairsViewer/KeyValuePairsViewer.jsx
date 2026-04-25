
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { clearKeyToAssign, storeKeyToAssign } from '@/actions/prototypePage'
import { Cursor } from '@/enums/Cursor'
import { withParentSize } from '@/hocs/withParentSize'
import { Localization, localize } from '@/localization/i18n'
import { keyValuePairLayoutShape } from '@/models/DocumentLayout'
import { theme } from '@/theme/theme.default'
import {
  Canvas,
  CanvasLine,
  CanvasScaleConfig,
} from '../Canvas'
import { useTooltip } from '../useTooltip'

const SizeAwareCanvas = withParentSize({
  monitorHeight: true,
  noPlaceholder: true,
})((props) => (
  <Canvas
    {...props}
    height={props.size.height}
    width={props.size.width}
  />
))

const MAX_SCALE = 6
const MIN_SCALE = 0.5
const SCALE_STEP = 0.1
const DASHED_LINE_LENGTH = 6
const DASHED_LINE_GAP = 2
const CONNECTION_LINE_STROKE_WIDTH = 0.5

const getMidpoint = (point1, point2) => ({
  x: (point1.x + point2.x) / 2,
  y: (point1.y + point2.y) / 2,
})

const getDistance = (point1, point2) => {
  const xDifference = point2.x - point1.x
  const yDifference = point2.y - point1.y
  const xDifferenceSquared = Math.pow(xDifference, 2)
  const yDifferenceSquared = Math.pow(yDifference, 2)

  return Math.sqrt(xDifferenceSquared + yDifferenceSquared)
}

const getPolygonEdges = (poly) => (
  poly.map((point, i) => [point, poly[(i + 1) % poly.length]])
)

const getClosestEdges = (poly1, poly2) => {
  let minDistance
  let closestEdges = []

  const edges1 = getPolygonEdges(poly1)
  const edges2 = getPolygonEdges(poly2)

  edges1.forEach((edge1) => {
    const midpoint1 = getMidpoint(...edge1)

    edges2.forEach((edge2) => {
      const midpoint2 = getMidpoint(...edge2)
      const distance = getDistance(midpoint1, midpoint2)

      if (!minDistance || distance < minDistance) {
        minDistance = distance
        closestEdges = [midpoint1, midpoint2]
      }
    })
  })

  return closestEdges
}

const KeyValuePairsViewer = ({
  imageUrl,
  onScaleChange,
  scaleFactor,
  keyValuePairs,
  checkIsKeyAssigned,
  isEditMode,
}) => {
  const [selectedKeyValuePairs, setSelectedKeyValuePairs] = useState(null)

  const dispatch = useDispatch()

  const {
    showTooltip,
    hideTooltip,
    renderTooltip,
  } = useTooltip({
    title: localize(Localization.SELECT_KEY_VALUE_TO_ASSIGN_TOOLTIP),
  })

  const getColor = useCallback((id, key) => {
    if (selectedKeyValuePairs === id) {
      return theme.color.primary2
    }

    if (checkIsKeyAssigned(key.content)) {
      return theme.color.greenBright
    }

    return theme.color.orange
  }, [checkIsKeyAssigned, selectedKeyValuePairs])

  const handleOnClick = useCallback((e, id, key) => {
    e.cancelBubble = true
    setSelectedKeyValuePairs(id)
    dispatch(storeKeyToAssign(key.content))
  }, [dispatch])

  const onMouseEnter = useCallback((e) => {
    const container = e.target.getStage().container()
    container.style.cursor = Cursor.POINTER

    showTooltip(e)
  }, [showTooltip])

  const onMouseMove = useCallback((e) => {
    const container = e.target.getStage().container()
    container.style.cursor !== Cursor.POINTER && hideTooltip()
  }, [hideTooltip])

  const onMouseLeave = useCallback((e) => {
    const container = e.target.getStage().container()
    container.style.cursor = Cursor.GRAB

    showTooltip.cancel()
    hideTooltip()
  }, [
    showTooltip,
    hideTooltip,
  ])

  const onWheel = useCallback(() => {
    hideTooltip()
  }, [hideTooltip])

  const canvasLines = useMemo(() => (
    keyValuePairs?.flatMap(({ key, value, id }) => {
      const editModeProps = {
        onClick: (e) => handleOnClick(e, id, key),
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        onWheel,
      }

      const polygons = [
        new CanvasLine({
          coords: key.polygon,
          closed: true,
          stroke: getColor(id, key),
          ...(isEditMode ? editModeProps : {}),
        }),
      ]

      if (value) {
        polygons.push(
          new CanvasLine({
            coords: value.polygon,
            closed: true,
            stroke: getColor(id, key),
            dash: [DASHED_LINE_LENGTH, DASHED_LINE_GAP],
            ...(isEditMode ? editModeProps : {}),
          }),
          new CanvasLine({
            coords: getClosestEdges(key.polygon, value.polygon),
            strokeWidth: CONNECTION_LINE_STROKE_WIDTH,
            stroke: getColor(id, key),
            ...(isEditMode ? editModeProps : {}),
          }),
        )
      }

      return polygons
    })
  ), [
    getColor,
    handleOnClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onWheel,
    isEditMode,
    keyValuePairs,
  ])

  const onStageClick = () => {
    setSelectedKeyValuePairs(null)
    dispatch(clearKeyToAssign())
  }

  const scaleConfig = new CanvasScaleConfig({
    min: MIN_SCALE,
    max: MAX_SCALE,
    step: SCALE_STEP,
    onChange: onScaleChange,
    value: scaleFactor,
  })

  return (
    <SizeAwareCanvas
      imageUrl={imageUrl}
      lines={canvasLines}
      onStageClick={onStageClick}
      renderExtra={renderTooltip}
      scaleConfig={scaleConfig}
    />
  )
}

KeyValuePairsViewer.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  keyValuePairs: PropTypes.arrayOf(
    keyValuePairLayoutShape,
  ),
  checkIsKeyAssigned: PropTypes.func.isRequired,
}

export {
  KeyValuePairsViewer,
}
