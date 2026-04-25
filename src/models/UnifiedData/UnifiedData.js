
import PropTypes from 'prop-types'
import { previewDocumentImageShape } from '@/models/DocumentImage'
import { documentTableShape } from '@/models/DocumentTable'
import { unifiedDataPositionalTextShape } from '@/models/UnifiedData'

const unifiedDataShape = PropTypes.shape({
  [PropTypes.string]: PropTypes.oneOfType([
    previewDocumentImageShape,
    documentTableShape,
    unifiedDataPositionalTextShape,
  ]),
})

class UnifiedData {
  static getBboxSourceIdByPage = (unifiedData, page) => {
    const activePageUD = unifiedData?.[page]

    if (!activePageUD) {
      return null
    }

    const blobUnifiedData = activePageUD.filter((d) => !!d.blobName)
    const { id } = blobUnifiedData.at(-1)
    return id
  }

  static getTheLastSourceIdByPage = (unifiedData, page) => {
    const activePageUD = unifiedData?.[page]

    if (!activePageUD) {
      return null
    }

    const { id } = activePageUD.at(-1)
    return id
  }

  static getBlobNameByPage = (unifiedData, page) => {
    const activePageUD = unifiedData?.[page]

    if (!activePageUD) {
      return null
    }

    const blobUnifiedData = activePageUD.filter((d) => !!d.blobName)
    const lastItem = blobUnifiedData.at(-1)

    if (!lastItem) {
      return null
    }

    return lastItem.blobName
  }

  static getBlobNameBySourceId = (unifiedData, sourceId) => {
    if (!unifiedData) {
      return null
    }

    const item = Object.values(unifiedData)
      .flat()
      .find((ud) => ud.id === sourceId)

    if (!item) {
      return null
    }

    return item.blobName || null
  }

  static getPagesQuantity = (unifiedData) => {
    if (!unifiedData) {
      return 0
    }
    return Object.keys(unifiedData).length
  }

  static getBlobNames = (unifiedData) => (
    Object.keys(unifiedData)
      .map((page) => UnifiedData.getBlobNameByPage(unifiedData, page))
  )

  static getPageBySourceId = (unifiedData, sourceId) => {
    const { page } = Object.values(unifiedData)
      .flat()
      .find((d) => d.id === sourceId)
    return page
  }
}

export {
  UnifiedData,
  unifiedDataShape,
}
