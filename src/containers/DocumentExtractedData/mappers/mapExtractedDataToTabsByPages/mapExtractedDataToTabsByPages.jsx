
import { Tab } from '@/components/Tabs'
import { Tooltip } from '@/components/Tooltip'
import { DocumentFields } from '@/containers/DocumentFields'
import { FileExtension } from '@/enums/FileExtension'
import { localize, Localization } from '@/localization/i18n'
import { ExtractedData } from '@/models/ExtractedData'
import { getFileExtension } from '@/utils/getFileExtension'
import { getExtractedDataToDisplay } from '../getExtractedDataToDisplay'
import { Asterisk } from './mapExtractedDataToTabsByPages.styles'

const ASTERISK = ' *'
const UNMATCHED_FIELDS_KEY = 'unmatched_fields'
const TABLE_FILES_EXTENSIONS = [
  FileExtension.XLSX,
  FileExtension.XLSM,
  FileExtension.XLTX,
  FileExtension.XLTM,
  FileExtension.XLS,
  FileExtension.CSV,
]

const mapExtractedDataToTabsByPages = ({
  document,
  documentType,
  highlightPolygonCoordsField,
  highlightTableCoordsField,
  ShouldHideEmptyEdFields,
}) => {
  const edToDisplay = getExtractedDataToDisplay({
    extractedData: document.extractedData,
    documentType,
    ShouldHideEmptyEdFields,
  })

  const [file] = document.files
  const extension = getFileExtension(file.blobName)

  const changeActivePage = TABLE_FILES_EXTENSIONS.includes(extension)
    ? highlightTableCoordsField
    : highlightPolygonCoordsField

  return (
    ExtractedData
      .getPages(edToDisplay, document)
      .map((page) => parseInt(page))
      .sort((a, b) => a - b || isNaN(a) - isNaN(b))
      .map((page) => new Tab(
        isNaN(page) ? UNMATCHED_FIELDS_KEY : `${page}`,
        isNaN(page)
          ? (
            <Tooltip
              title={localize(Localization.CONTAINS_FIELDS_WITHOUT_EXTRACTED_DATA)}
            >
              {localize(Localization.UNMATCHED_FIELDS)}
              <Asterisk>
                {ASTERISK}
              </Asterisk>
            </Tooltip>
          )
          : (
            <span onClick={() => changeActivePage({ page })}>
              {localize(Localization.PAGE_LABEL, { page })}
            </span>
          ),
        <DocumentFields
          fields={ExtractedData.getFieldsByPage(edToDisplay, page, document)}
        />,
      ))
  )
}

export {
  mapExtractedDataToTabsByPages,
}
