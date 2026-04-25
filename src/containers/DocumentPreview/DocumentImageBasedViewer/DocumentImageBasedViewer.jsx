
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { PdfViewer } from '@/containers/PdfViewer'
import { FileExtension } from '@/enums/FileExtension'
import { Document, documentShape } from '@/models/Document'
import { highlightedFieldShape } from '@/models/HighlightedField'
import { pointShape } from '@/models/Point'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { getFileExtension } from '@/utils/getFileExtension'
import { DocumentImagePageSwitcher } from '../DocumentImagePageSwitcher'
import { DocumentImagePreview } from '../DocumentImagePreview'

const DocumentImageBasedViewer = ({
  activePage,
  activePolygons,
  activeSourceId,
  addActivePolygons,
  clearActivePolygons,
  document,
  highlightedField,
  onChangeActiveImagePage,
  previewAvailable,
}) => {
  const [file] = document.files
  const extension = useMemo(() => getFileExtension(file.blobName), [file.blobName])

  const renderPageSwitcher = useCallback(() => (
    <DocumentImagePageSwitcher
      activePage={activePage}
      disabled={!previewAvailable}
      onChangeActivePage={onChangeActiveImagePage}
      pagesQuantity={Document.getPagesQuantity(document)}
    />
  ), [
    activePage,
    document,
    onChangeActiveImagePage,
    previewAvailable,
  ])

  if (extension === FileExtension.PDF && ENV.FEATURE_PDF_VIEWER) {
    const pdfUrl = apiMap.apiGatewayV2.v5.file.blob(file.blobName)

    return (
      <PdfViewer
        PageSwitcher={DocumentImagePageSwitcher}
        activePolygons={activePolygons}
        onAddActivePolygons={addActivePolygons}
        onClearActivePolygons={clearActivePolygons}
        setActivePage={onChangeActiveImagePage}
        url={pdfUrl}
      />
    )
  }

  return (
    <DocumentImagePreview
      activePage={activePage}
      activePolygons={activePolygons}
      activeSourceId={activeSourceId}
      document={document}
      highlightedField={highlightedField}
      onAddActivePolygons={addActivePolygons}
      onClearActivePolygons={clearActivePolygons}
      renderPageSwitcher={renderPageSwitcher}
    />
  )
}

DocumentImageBasedViewer.propTypes = {
  activePage: PropTypes.number.isRequired,
  activePolygons: PropTypes.arrayOf(
    PropTypes.arrayOf(pointShape),
  ),
  activeSourceId: PropTypes.string,
  addActivePolygons: PropTypes.func.isRequired,
  clearActivePolygons: PropTypes.func.isRequired,
  document: documentShape.isRequired,
  highlightedField: highlightedFieldShape,
  onChangeActiveImagePage: PropTypes.func.isRequired,
  previewAvailable: PropTypes.bool.isRequired,
}

export {
  DocumentImageBasedViewer,
}
