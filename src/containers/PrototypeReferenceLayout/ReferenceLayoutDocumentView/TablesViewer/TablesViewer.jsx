
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useImage from 'use-image'
import { setActiveTable, toggleAddFieldDrawer } from '@/actions/prototypePage'
import PlusIcon from '@/assets/images/plusCircle.png'
import { Cursor } from '@/enums/Cursor'
import { withParentSize } from '@/hocs/withParentSize'
import { Localization, localize } from '@/localization/i18n'
import { tableLayoutShape } from '@/models/DocumentLayout'
import { activeTableSelector } from '@/selectors/prototypePage'
import { theme } from '@/theme/theme.default'
import {
  Canvas,
  CanvasLine,
  CanvasScaleConfig,
  CanvasImage,
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

const ADD_FIELD_IMAGE_SIZE = {
  width: 28,
  height: 28,
}

const ADD_FIELD_IMAGE_OFFSET = {
  offsetX: 14,
  offsetY: 14,
}

const getTopRightCorner = (points) => {
  const topRightScore = (point) => point.x - point.y

  return points.reduce((currentTopRight, point) => (
    topRightScore(point) > topRightScore(currentTopRight)
      ? point
      : currentTopRight
  ), points[0])
}

const TablesViewer = ({
  imageUrl,
  onScaleChange,
  scaleFactor,
  tables,
  isEditMode,
}) => {
  const activeTable = useSelector(activeTableSelector)
  const [addFieldImage] = useImage(PlusIcon)

  const dispatch = useDispatch()

  const {
    showTooltip,
    hideTooltip,
    renderTooltip,
  } = useTooltip({
    title: localize(Localization.SELECT_TABLE_TO_CREATE_NEW_FIELD),
  })

  const handleAddFieldImageClick = useCallback((e) => {
    e.cancelBubble = true
    dispatch(toggleAddFieldDrawer())
  }, [dispatch])

  const handleTableClick = useCallback((e, id) => {
    e.cancelBubble = true

    const table = tables?.find((t) => t.id === id)
    dispatch(setActiveTable(table))
  }, [dispatch, tables])

  const getColor = useCallback((id) => {
    if (activeTable?.id === id) {
      return theme.color.primary2
    }

    return theme.color.orange
  }, [activeTable?.id])

  const setPointerCursor = (e) => {
    const container = e.target.getStage().container()
    container.style.cursor = Cursor.POINTER
  }

  const setGrabCursor = (e) => {
    const container = e.target.getStage().container()
    container.style.cursor = Cursor.GRAB
  }

  const handleTableMouseEnter = useCallback((e) => {
    setPointerCursor(e)
    showTooltip(e)
  }, [showTooltip])

  const handleMouseMove = useCallback((e) => {
    const container = e.target.getStage().container()
    container.style.cursor !== Cursor.POINTER && hideTooltip()
  }, [hideTooltip])

  const handleTableMouseLeave = useCallback((e) => {
    setGrabCursor(e)
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
    tables?.flatMap(({ polygon, id }) => {
      const editModeProps = {
        onClick: (e) => handleTableClick(e, id),
        onMouseEnter: handleTableMouseEnter,
        onMouseLeave: handleTableMouseLeave,
        onMouseMove: handleMouseMove,
        onWheel,
      }

      return [
        new CanvasLine({
          coords: polygon,
          closed: true,
          stroke: getColor(id),
          ...(isEditMode ? editModeProps : {}),
        }),
      ]
    })
  ), [
    getColor,
    handleTableClick,
    handleTableMouseEnter,
    handleTableMouseLeave,
    handleMouseMove,
    onWheel,
    isEditMode,
    tables,
  ])

  const handleStageClick = () => {
    dispatch(setActiveTable(null))
  }

  const scaleConfig = new CanvasScaleConfig({
    min: MIN_SCALE,
    max: MAX_SCALE,
    step: SCALE_STEP,
    onChange: onScaleChange,
    value: scaleFactor,
  })

  const tableActionImage = useMemo(() => {
    if (
      !isEditMode ||
      !activeTable ||
      !tables?.length
    ) {
      return
    }

    const table = tables.find((t) => t.id === activeTable.id)

    if (!table) {
      return
    }

    const topRight = getTopRightCorner(table.polygon)
    const editModeProps = {
      onClick: handleAddFieldImageClick,
      onMouseEnter: setPointerCursor,
      onMouseLeave: setGrabCursor,
      onMouseMove: handleMouseMove,
    }

    return [
      new CanvasImage({
        image: addFieldImage,
        x: topRight.x,
        y: topRight.y,
        ...editModeProps,
        ...ADD_FIELD_IMAGE_SIZE,
        ...ADD_FIELD_IMAGE_OFFSET,
      }),
    ]
  },
  [
    addFieldImage,
    activeTable,
    handleAddFieldImageClick,
    handleMouseMove,
    isEditMode,
    tables,
  ])

  return (
    <SizeAwareCanvas
      imageUrl={imageUrl}
      images={tableActionImage}
      lines={canvasLines}
      onStageClick={handleStageClick}
      renderExtra={renderTooltip}
      scaleConfig={scaleConfig}
    />
  )
}

TablesViewer.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  scaleFactor: PropTypes.number.isRequired,
  tables: PropTypes.arrayOf(tableLayoutShape),
}

export {
  TablesViewer,
}
