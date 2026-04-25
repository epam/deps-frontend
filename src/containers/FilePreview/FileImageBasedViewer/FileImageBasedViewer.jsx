
import { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { clearActivePolygons, setHighlightedField } from '@/actions/fileReviewPage'
import { setUi } from '@/actions/navigation'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { UiKeys } from '@/constants/navigation'
import { ImagePageSwitcher } from '@/containers/ImagePageSwitcher'
import { PdfViewer } from '@/containers/PdfViewer'
import { FileExtension } from '@/enums/FileExtension'
import { apiMap } from '@/utils/apiMap'
import { ENV } from '@/utils/env'
import { getFileExtension } from '@/utils/getFileExtension'
import { FileImagePreview } from '../FileImagePreview'

const FileImageBasedViewer = () => {
  const { fileId } = useParams()

  const { data: file } = useFetchFileQuery(fileId)

  const extension = useMemo(() => getFileExtension(file.name), [file])

  const dispatch = useDispatch()

  const setActivePage = useCallback((page) => {
    dispatch(setUi({
      [UiKeys.ACTIVE_PAGE]: page,
    }))
    dispatch(clearActivePolygons())
    dispatch(setHighlightedField(null))
  }, [dispatch])

  const url = apiMap.apiGatewayV2.v5.file.blob(file.path)

  switch (extension) {
    case FileExtension.JPG:
    case FileExtension.JPEG:
    case FileExtension.PNG:
    case FileExtension.TIFF:
    case FileExtension.TIF:
      return (
        <FileImagePreview />
      )
    case FileExtension.PDF:
      return (
        ENV.FEATURE_PDF_VIEWER
          ? (
            <PdfViewer
              PageSwitcher={ImagePageSwitcher}
              setActivePage={setActivePage}
              url={url}
            />
          )
          : (
            <FileImagePreview />
          )
      )
    default:
      return null
  }
}

export {
  FileImageBasedViewer,
}
