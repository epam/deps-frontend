
import PropTypes from 'prop-types'
import {
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { Page as ReactPdfPage } from 'react-pdf'
import { useSelector } from 'react-redux'
import { useCanvasPolygons } from '@/components/ImageViewer'
import { UiKeys } from '@/constants/navigation'
import { withFlexibleParentSize } from '@/hocs/withParentSize'
import { localize, Localization } from '@/localization/i18n'
import { pointShape } from '@/models/Point'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'

const IN_VIEW_DELAY_MS = 400

const ONE_THIRD = 1 / 3
const TWO_THIRDS = 2 / 3
const HALF = 1 / 2

const CANVAS_CONTEXT_TYPE = '2d'

const VIEW_POSITION = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
}

const mapCoordToPosition = (coord) => {
  if (coord < ONE_THIRD) {
    return VIEW_POSITION.START
  }

  if (coord < TWO_THIRDS) {
    return VIEW_POSITION.CENTER
  }

  return VIEW_POSITION.END
}

const MAX_RGBA_VALUE = 255

const PdfPage = ({
  getPdfSpaceArea,
  pageNumber,
  setVisiblePage,
  size,
  scale,
  activePolygons,
  onAddActivePolygons,
  onClearActivePolygons,
}) => {
  const [dynamicThreshold, setDynamicThreshold] = useState(0)
  const [imageRendered, setImageRendered] = useState(null)

  const uiState = useSelector(uiSelector)
  const highlightedField = useSelector(highlightedFieldSelector)

  const activePage = uiState[UiKeys.ACTIVE_PAGE] || 1

  const pdfPageRef = useRef()
  const canvasRef = useRef()

  const { drawPolygons } = useCanvasPolygons({
    context: canvasRef.current?.getContext(CANVAS_CONTEXT_TYPE),
    polygons: highlightedField,
    activePolygons,
    onAddActivePolygons,
    onClearActivePolygons,
  })

  const { ref: setRefInView, inView } = useInView({
    threshold: dynamicThreshold,
    delay: IN_VIEW_DELAY_MS,
  })

  const isBlankPage = useCallback((imageData) => imageData.data.every((pixelValue) => pixelValue === MAX_RGBA_VALUE), [])

  const renderBlankDisclaimer = useCallback(() => {
    const ctx = canvasRef.current.getContext(CANVAS_CONTEXT_TYPE)
    ctx.font = '5rem sans-serif'

    const text = localize(Localization.BLANK_PAGE_IN_PDF_DISCLAIMER)

    const lines = text.split('\n')

    const lineHeight = parseInt(ctx.font.match(/\d+/), 10)
    const textBlockHeight = lineHeight * lines.length

    let y = (canvasRef.current.height - textBlockHeight) / 2 + lineHeight

    lines.forEach((line) => {
      const textWidth = ctx.measureText(line).width
      const x = (canvasRef.current.width - textWidth) / 2
      ctx.fillText(line, x, y)
      y += lineHeight
    })
  }, [])

  const onRenderSuccess = useCallback((page) => {
    const pageArea = page.height * page.width
    const availableArea = getPdfSpaceArea()

    const dynamicInViewThreshold = Math.min(1, HALF * (availableArea / pageArea))

    setDynamicThreshold(dynamicInViewThreshold)

    const ctx = canvasRef.current.getContext(CANVAS_CONTEXT_TYPE)

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    setImageRendered(imageData)

    isBlankPage(imageData) && renderBlankDisclaimer()
  }, [getPdfSpaceArea, isBlankPage, renderBlankDisclaimer])

  const setRef = useCallback((node) => {
    setRefInView(node)
    pdfPageRef.current = node
  }, [setRefInView])

  useEffect(() => {
    if (
      !pdfPageRef.current ||
      !!highlightedField ||
      pageNumber !== activePage
    ) {
      return
    }

    pdfPageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: VIEW_POSITION.START,
      inline: VIEW_POSITION.START,
    })
  }, [activePage, highlightedField, pageNumber])

  useEffect(() => {
    if (
      !canvasRef.current ||
      !imageRendered ||
      !highlightedField ||
      pageNumber !== activePage
    ) {
      return
    }

    if (
      imageRendered.width !== canvasRef.current.width ||
      imageRendered.height !== canvasRef.current.height
    ) {
      return
    }

    const [[firstPolygonPoint]] = highlightedField

    pdfPageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: mapCoordToPosition(firstPolygonPoint.y),
      inline: mapCoordToPosition(firstPolygonPoint.x),
    })

    const ctx = canvasRef.current.getContext(CANVAS_CONTEXT_TYPE)

    ctx.putImageData(imageRendered, 0, 0)
    drawPolygons(canvasRef.current.width, canvasRef.current.height)

    return () => {
      ctx.putImageData(imageRendered, 0, 0)
    }
  }, [activePage, drawPolygons, highlightedField, imageRendered, pageNumber])

  useEffect(() => {
    if (!inView || !imageRendered) {
      return
    }
    setVisiblePage(pageNumber)
  }, [imageRendered, inView, pageNumber, setVisiblePage])

  return (
    <ReactPdfPage
      canvasRef={canvasRef}
      inputRef={setRef}
      onRenderSuccess={onRenderSuccess}
      pageNumber={pageNumber}
      scale={scale}
      width={size.width}
    />
  )
}

PdfPage.propTypes = {
  getPdfSpaceArea: PropTypes.func.isRequired,
  pageNumber: PropTypes.number.isRequired,
  setVisiblePage: PropTypes.func.isRequired,
  size: PropTypes.exact({
    width: PropTypes.number.isRequired,
    height: PropTypes.number,
  }).isRequired,
  scale: PropTypes.number.isRequired,
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  onAddActivePolygons: PropTypes.func,
  onClearActivePolygons: PropTypes.func,
}

const SizedPdfPage = withFlexibleParentSize({
  height: 'fit-content',
})(PdfPage)

export {
  SizedPdfPage as PdfPage,
}
