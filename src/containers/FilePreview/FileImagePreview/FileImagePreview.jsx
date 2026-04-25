
import {
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import {
  addActivePolygons,
  clearActivePolygons,
  highlightPolygonCoordsField,
} from '@/actions/fileReviewPage'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { ImageViewer } from '@/components/ImageViewer'
import { Spin } from '@/components/Spin'
import { UiKeys } from '@/constants/navigation'
import { UnifiedData } from '@/models/UnifiedData'
import { highlightedFieldSelector } from '@/selectors/fileReviewPage'
import { uiSelector } from '@/selectors/navigation'
import { activePolygonsSelector } from '@/selectors/reviewPage'
import { FileCache } from '@/services/FileCache'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { FileImagePageSwitcher } from './FileImagePageSwitcher'
import { FileImagePreviewHotkeys } from './FileImagePreviewHotkeys'

const cacheFileImages = async (unifiedData) => {
  if (!unifiedData) {
    return
  }

  const blobNames = UnifiedData.getBlobNames(unifiedData)

  const urls = blobNames.map((blobName) => apiMap.apiGatewayV2.v5.file.blob(blobName))

  await FileCache.requestAndStore(urls)
}

const FileImagePreview = () => {
  const dispatch = useDispatch()

  const { fileId } = useParams()

  const activePage = useSelector(uiSelector)[UiKeys.ACTIVE_PAGE] || 1

  const activeSourceId = useSelector(uiSelector)[UiKeys.ACTIVE_SOURCE_ID]

  const activePolygons = useSelector(activePolygonsSelector)
  const highlightedField = useSelector(highlightedFieldSelector)

  const {
    data: unifiedData,
    isFetching,
  } = useFetchFileUnifiedDataQuery(fileId)

  const [isCachingFirstImage, setIsCachingFirstImage] = useState(false)

  const hasCachedRef = useRef(false)

  const blobName = useMemo(() => {
    if (!activeSourceId) {
      return UnifiedData.getBlobNameByPage(unifiedData, activePage)
    }
    return UnifiedData.getBlobNameBySourceId(unifiedData, activeSourceId)
  }, [activeSourceId, activePage, unifiedData])

  const imageUrl = useMemo(() => (
    blobName ? apiMap.apiGatewayV2.v5.file.blob(blobName) : null
  ), [blobName])

  const onChangeActiveImagePage = useCallback((page) => {
    dispatch(highlightPolygonCoordsField({
      page,
      unifiedData,
    }))
  }, [dispatch, unifiedData])

  const renderPageSwitcher = useCallback(() => (
    <FileImagePageSwitcher
      activePage={activePage}
      onChangeActivePage={onChangeActiveImagePage}
      pagesQuantity={UnifiedData.getPagesQuantity(unifiedData)}
    />
  ), [activePage, onChangeActiveImagePage, unifiedData])

  const onAddActivePolygons = useCallback((polygon) => {
    dispatch(addActivePolygons(polygon))
  }, [dispatch])

  const onClearActivePolygons = useCallback(() => {
    dispatch(clearActivePolygons())
  }, [dispatch])

  useEffect(() => {
    const cacheImages = async () => {
      if (!ENV.FEATURE_FILE_CACHE && hasCachedRef.current) {
        return
      }

      if (!imageUrl) {
        return
      }

      setIsCachingFirstImage(true)

      try {
        await FileCache.requestAndStore([imageUrl])
      } finally {
        setIsCachingFirstImage(false)
        hasCachedRef.current = true
      }

      cacheFileImages(unifiedData)
    }

    cacheImages()
  }, [imageUrl, unifiedData])

  if (isFetching || !imageUrl) {
    return <Spin spinning />
  }

  return (
    <>
      {!isFetching && <FileImagePreviewHotkeys />}
      <ImageViewer
        activePage={activePage}
        activePolygons={activePolygons}
        fetching={isCachingFirstImage || isFetching}
        imageUrl={imageUrl}
        onAddActivePolygons={onAddActivePolygons}
        onClearActivePolygons={onClearActivePolygons}
        polygons={highlightedField}
        renderPageSwitcher={renderPageSwitcher}
        scaling
      />
    </>
  )
}

export {
  FileImagePreview,
}
