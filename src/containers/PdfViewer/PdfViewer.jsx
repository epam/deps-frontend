
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVisiblePdfPage } from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { RotateLeftIcon } from '@/components/Icons/RotateLeftIcon'
import { RotateRightIcon } from '@/components/Icons/RotateRightIcon'
import { Spin } from '@/components/Spin'
import { UiKeys } from '@/constants/navigation'
import { pointShape } from '@/models/Point'
import { uiSelector } from '@/selectors/navigation'
import { FileCache } from '@/services/FileCache'
import { initPdfWorker } from './initPdfWorker'
import { PdfPage } from './PdfPage'
import {
  ReactPdfDocument,
  Wrapper,
  Controls,
  RotationWrapper,
  CommandsSeparator,
  Slider,
  ControlsSection,
} from './PdfViewer.styles'

initPdfWorker()

const options = {
  enableHWA: true,
}

const MAX_SCALE = 600
const MIN_SCALE = 50
const SCALE_STEP = 10

export const PdfViewer = ({
  PageSwitcher,
  url,
  setActivePage,
  activePolygons,
  onAddActivePolygons,
  onClearActivePolygons,
}) => {
  const uiState = useSelector(uiSelector)

  const dispatch = useDispatch()

  const visiblePage = useMemo(() => uiState[UiKeys.VISIBLE_PDF_PAGE] ?? 1, [uiState])

  const setVisiblePage = useCallback((page) => {
    dispatch(setVisiblePdfPage(page))
  }, [dispatch])

  const [numPages, setNumPages] = useState()
  const [binaryPdfFile, setBinaryPdfFile] = useState()
  const [fetching, setFetching] = useState(true)
  const [failedToLoad, setFailedToLoad] = useState(false)
  const [loading, setLoading] = useState(true)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [scaleFactor, setScaleFactor] = useState(100)

  const ref = useRef()

  const getPdfSpaceArea = useCallback(() => (
    ref.current.clientWidth * ref.current.clientHeight
  ), [])

  const onPdfLoadSuccess = useCallback((corePDFjs) => {
    setNumPages(corePDFjs.numPages)
    setLoading(false)
  }, [])

  const onPdfLoadError = useCallback(() => {
    setFailedToLoad(true)
  }, [])

  const onChangeActiveImagePage = useCallback((page) => {
    setActivePage(page)
  }, [setActivePage])

  const onRotateLeft = useCallback(() => {
    const newRotationAngle = (rotationAngle - 90 + 360) % 360
    setRotationAngle(newRotationAngle)
  }, [rotationAngle])

  const onRotateRight = useCallback(() => {
    const newRotationAngle = (rotationAngle + 90) % 360
    setRotationAngle(newRotationAngle)
  }, [rotationAngle])

  const fetchPDF = useCallback(async () => {
    try {
      let pdf = await FileCache.get(url)

      if (!pdf) {
        const cachedData = await FileCache.requestAndStore([url])
        pdf = cachedData[url]
      }

      setBinaryPdfFile(pdf)
    } finally {
      setFetching(false)
    }
  }, [url])

  const areControlsVisible = useMemo(() => !loading && !failedToLoad, [loading, failedToLoad])

  useEffect(() => {
    fetchPDF()
  }, [fetchPDF])

  if (fetching) {
    return <Spin.Centered spinning />
  }

  return (
    <Wrapper>
      {
        areControlsVisible && (
          <Controls>
            <ControlsSection>
              <RotationWrapper>
                <Button.Icon
                  icon={<RotateLeftIcon />}
                  onClick={onRotateLeft}
                />
                <Button.Icon
                  icon={<RotateRightIcon />}
                  onClick={onRotateRight}
                />
              </RotationWrapper>
              <CommandsSeparator />
              <Slider
                max={MAX_SCALE}
                min={MIN_SCALE}
                onChange={setScaleFactor}
                step={SCALE_STEP}
                value={scaleFactor}
                valuePrefix={'%'}
              />
            </ControlsSection>
            <CommandsSeparator />
            <PageSwitcher
              activePage={visiblePage}
              onChangeActivePage={onChangeActiveImagePage}
              pagesQuantity={numPages}
            />
          </Controls>
        )
      }
      <ReactPdfDocument
        file={binaryPdfFile}
        inputRef={ref}
        onLoadError={onPdfLoadError}
        onLoadSuccess={onPdfLoadSuccess}
        options={options}
        rotate={rotationAngle}
      >
        {
          Array.from(new Array(numPages), (_, pageIndex) => (
            <PdfPage
              key={pageIndex}
              activePolygons={activePolygons}
              getPdfSpaceArea={getPdfSpaceArea}
              onAddActivePolygons={onAddActivePolygons}
              onClearActivePolygons={onClearActivePolygons}
              pageNumber={pageIndex + 1}
              scale={scaleFactor / 100}
              setVisiblePage={setVisiblePage}
            />
          ))
        }
      </ReactPdfDocument>
    </Wrapper>
  )
}

PdfViewer.propTypes = {
  url: PropTypes.string.isRequired,
  PageSwitcher: PropTypes.elementType.isRequired,
  setActivePage: PropTypes.func.isRequired,
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  onAddActivePolygons: PropTypes.func,
  onClearActivePolygons: PropTypes.func,
}
