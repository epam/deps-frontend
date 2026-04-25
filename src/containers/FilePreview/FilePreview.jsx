
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { getFileExtension } from '@/utils/getFileExtension'
import { FileDocxViewer } from './FileDocxViewer'
import { FileImageBasedViewer } from './FileImageBasedViewer'
import { Empty } from './FilePreview.styles'
import { FileTableViewer } from './FileTableViewer'

const IMAGE_EXTENSIONS = [
  FileExtension.JPG,
  FileExtension.JPEG,
  FileExtension.PNG,
  FileExtension.TIFF,
  FileExtension.TIF,
  FileExtension.PDF,
]

const TABLE_EXTENSIONS = [
  FileExtension.XLSX,
  FileExtension.XLSM,
  FileExtension.XLTX,
  FileExtension.XLTM,
  FileExtension.XLS,
  FileExtension.CSV,
]

const FILE_EXTENSION_TO_VIEWER = {
  ...Object.fromEntries(IMAGE_EXTENSIONS.map((ext) => [ext, FileImageBasedViewer])),
  ...Object.fromEntries(TABLE_EXTENSIONS.map((ext) => [ext, FileTableViewer])),
  [FileExtension.DOCX]: FileDocxViewer,
}

const FilePreview = () => {
  const { fileId } = useParams()

  const { data: file } = useFetchFileQuery(fileId)

  const extension = useMemo(() => getFileExtension(file.name), [file])

  const ViewerComponent = FILE_EXTENSION_TO_VIEWER[extension]

  if (ViewerComponent) {
    return <ViewerComponent />
  }

  return (
    <Empty
      description={
        localize(Localization.UNSUPPORTED_EXTENSION,
          { fileExtension: extension },
        )
      }
    />
  )
}

export {
  FilePreview,
}
