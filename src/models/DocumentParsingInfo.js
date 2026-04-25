
import PropTypes from 'prop-types'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { KnownTabularLayoutParsingType } from '@/enums/KnownTabularLayoutParsingType'

class DocumentParsingInfo {
  constructor ({
    layoutId,
    documentLayoutInfo,
    tabularLayoutInfo,
  }) {
    this.layoutId = layoutId
    this.documentLayoutInfo = documentLayoutInfo
    this.tabularLayoutInfo = tabularLayoutInfo
  }
}

class TabularLayoutInfo {
  constructor ({
    id,
    parsingType,
    sheets,
  }) {
    this.id = id
    this.parsingType = parsingType
    this.sheets = sheets
  }
}

class DocumentLayoutInfo {
  constructor ({
    documentLayoutId,
    parsingFeatures,
    pagesInfo,
    mergedTables,
  }) {
    this.documentLayoutId = documentLayoutId
    this.parsingFeatures = parsingFeatures
    this.pagesInfo = pagesInfo
    this.mergedTables = mergedTables
  }

  static getParsingType = (documentLayoutInfo) => Object.keys(documentLayoutInfo.parsingFeatures)

  static getParsingTypeAndFeatures = (documentLayoutInfo) => {
    if (documentLayoutInfo.parsingFeatures.USER_DEFINED) {
      return {
        parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
        features: documentLayoutInfo.parsingFeatures.USER_DEFINED,
      }
    }

    return (
      Object.entries(documentLayoutInfo.parsingFeatures).reduce(
        (acc, currentItem) => {
          const [type, features] = currentItem

          if (!acc.features || features.length >= acc.features.length) {
            acc.parsingType = type
            acc.features = features
          }
          return acc
        }, {})
    )
  }
}

class SheetInfo {
  constructor ({
    id,
    title,
    isHidden,
    tables,
    images,
  }) {
    this.id = id
    this.title = title
    this.isHidden = isHidden
    this.tables = tables
    this.images = images
  }
}

class TableInfo {
  constructor ({
    id,
    rowCount,
    columnCount,
  }) {
    this.id = id
    this.rowCount = rowCount
    this.columnCount = columnCount
  }
}

const tableInfoShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnCount: PropTypes.number.isRequired,
})

const sheetInfoShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isHidden: PropTypes.bool.isRequired,
  tables: PropTypes.arrayOf(tableInfoShape).isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
})

const tabularLayoutInfoShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  parsingType: PropTypes.oneOf(
    Object.values(KnownTabularLayoutParsingType),
  ).isRequired,
  sheets: PropTypes.arrayOf(
    sheetInfoShape,
  ).isRequired,
})

export {
  DocumentParsingInfo,
  TabularLayoutInfo,
  DocumentLayoutInfo,
  TableInfo,
  SheetInfo,
  tabularLayoutInfoShape,
  tableInfoShape,
  sheetInfoShape,
}
