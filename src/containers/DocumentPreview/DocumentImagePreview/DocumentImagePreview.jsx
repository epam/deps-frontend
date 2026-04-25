
import PropTypes from 'prop-types'
import {
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react'
import { ImageViewer } from '@/components/ImageViewer'
import { Document, documentShape } from '@/models/Document'
import { highlightedPolygonCoordsShape } from '@/models/HighlightedField'
import { pointShape } from '@/models/Point'
import { FileCache } from '@/services/FileCache'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { DocumentImagePreviewHotkeys } from './DocumentImagePreviewHotkeys'

const cacheDocumentImages = async (document) => {
  if (!document.unifiedData) {
    return
  }

  const blobNames = Document.getBlobNames(document) ?? []
  const urls = blobNames.map((blobName) => apiMap.apiGatewayV2.v5.file.blob(blobName))

  await FileCache.requestAndStore(urls)
}

const DocumentImagePreview = ({
  activeSourceId,
  activePage,
  activePolygons,
  document,
  highlightedField,
  onAddActivePolygons,
  onClearActivePolygons,
  renderPageSwitcher,
}) => {
  const [isCachingFirstImage, setIsCachingFirstImage] = useState(false)

  const hasCachedRef = useRef(false)

  const blobName = useMemo(() => {
    if (!activeSourceId) {
      return Document.getBlobNameByPage(document, activePage)
    }
    return Document.getBlobNameBySourceId(document, activeSourceId)
  }, [activePage, activeSourceId, document])

  const imageUrl = useMemo(() => apiMap.apiGatewayV2.v5.file.blob(blobName), [blobName])

  useEffect(() => {
    const cacheImages = async () => {
      if (!ENV.FEATURE_FILE_CACHE && hasCachedRef.current) {
        return
      }

      setIsCachingFirstImage(true)

      try {
        const firstImageUrl = apiMap.apiGatewayV2.v5.file.blob(blobName)
        await FileCache.requestAndStore([firstImageUrl])
      } finally {
        setIsCachingFirstImage(false)
        hasCachedRef.current = true
      }

      cacheDocumentImages(document)
    }

    cacheImages()
  }, [document, blobName])

  return (
    <>
      <DocumentImagePreviewHotkeys />
      <ImageViewer
        activePolygons={activePolygons}
        fetching={isCachingFirstImage}
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

DocumentImagePreview.propTypes = {
  activePage: PropTypes.number.isRequired,
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  activeSourceId: PropTypes.string,
  document: documentShape.isRequired,
  highlightedField: highlightedPolygonCoordsShape,
  onAddActivePolygons: PropTypes.func.isRequired,
  onClearActivePolygons: PropTypes.func.isRequired,
  renderPageSwitcher: PropTypes.func.isRequired,
}

export {
  DocumentImagePreview,
}
