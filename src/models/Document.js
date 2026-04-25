
import PropTypes from 'prop-types'
import { ContainerType } from '@/enums/ContainerType'
import { previewDocumentImageShape, processingImageShape } from '@/models/DocumentImage'
import { documentReviewerShape } from '@/models/DocumentReviewer'
import { emailShape } from '@/models/Email'
import { extractedDataFieldShape } from '@/models/ExtractedData'
import { labelShape } from '@/models/Label'
import {
  UnifiedData,
  unifiedDataShape,
} from '@/models/UnifiedData'
import { apiMap } from '@/utils/apiMap'
import { commentShape } from './Comment'
import { documentLayoutShape } from './DocumentLayout'
import { documentTableShape } from './DocumentTable'
import { DocumentType, UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY } from './DocumentType'
import { documentValidationShape } from './DocumentValidation'
import { previewEntityShape } from './PreviewEntity'

const documentErrorShape = PropTypes.shape({
  description: PropTypes.string.isRequired,
  inState: PropTypes.string,
})

const previewDocumentsShape = PropTypes.objectOf(
  PropTypes.oneOfType([
    previewDocumentImageShape,
    documentTableShape,
  ]),
)

const processingDocumentsShape = PropTypes.objectOf(
  PropTypes.oneOfType([
    processingImageShape,
    documentTableShape,
  ]),
)

class File {
  constructor (url, blobName) {
    this.url = url
    this.blobName = blobName
  }
}

const fileShape = PropTypes.shape({
  url: PropTypes.string.isRequired,
  blobName: PropTypes.string.isRequired,
})

const groupInfoShape = PropTypes.shape({
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
})

const documentShape = PropTypes.shape({
  _id: PropTypes.string,
  communication: PropTypes.shape({
    comments: PropTypes.arrayOf(commentShape),
  }),
  containerMetadata: emailShape,
  containerType: PropTypes.oneOf(Object.values(ContainerType)),
  date: PropTypes.string,
  documentType: previewEntityShape,
  files: PropTypes.arrayOf(fileShape),
  groupInfo: groupInfoShape,
  labels: PropTypes.arrayOf(labelShape.isRequired),
  language: PropTypes.string,
  reviewer: documentReviewerShape,
  state: PropTypes.string,
  title: PropTypes.string,
  error: documentErrorShape,
  extractedData: PropTypes.arrayOf(extractedDataFieldShape),
  previewDocuments: previewDocumentsShape,
  processingDocuments: processingDocumentsShape,
  unifiedData: unifiedDataShape,
  relations: PropTypes.shape({
    documentPartNumber: PropTypes.number,
    relatedDocumentIds: PropTypes.arrayOf(PropTypes.string),
  }),
  scrapedMetadata: PropTypes.shape({
    apiNumber: PropTypes.string.isRequired,
  }),
  validation: documentValidationShape,
  documentLayout: documentLayoutShape,
  llmType: PropTypes.string,
})

class Document {
  constructor ({
    id,
    date,
    engine,
    error,
    extractedData,
    validation,
    previewDocuments = {},
    processingDocuments = {},
    documentType = '',
    communication = { // TODO: #4078
      flagged: false,
      comments: [],
    },
    containerMetadata = null,
    containerType = null,
    groupInfo,
    labels = [],
    state = '',
    files = [],
    reviewer = null,
    language = null,
    unifiedData,
    title = '',
    initialDocumentData,
    documentLayout,
    llmType,
  } = {}) {
    this._id = id
    this.extractedData = extractedData
    this.previewDocuments = previewDocuments
    this.processingDocuments = processingDocuments
    this.documentType = documentType
    this.containerMetadata = containerMetadata
    this.validation = validation
    this.communication = communication
    this.containerType = containerType
    this.groupInfo = groupInfo
    this.engine = engine
    this.error = error
    this.date = date
    this.labels = labels
    this.files = files
    this.reviewer = reviewer
    this.state = state
    this.title = title
    this.language = language
    this.unifiedData = unifiedData
    this.initialDocumentData = initialDocumentData
    this.documentLayout = documentLayout
    if (llmType) {
      this.llmType = llmType
    }
  }

  static getBlobNames = (document) => (
    Object.keys(document.unifiedData).map((page) => Document.getBlobNameByPage(document, page))
  )

  static getBlobNameBySourceId = (document, sourceId) => {
    const { blobName } = Object.values(document.unifiedData)
      .flat()
      .find((ud) => ud.id === sourceId)
    return blobName
  }

  static getBlobNameByPage = (document, page) => {
    if (document.unifiedData) {
      const activePageUD = document.unifiedData[page]
      const blobUnifiedData = activePageUD.filter((d) => !!d.blobName)
      const { blobName } = blobUnifiedData.at(-1)
      return blobName
    }
    const { blobName } = document.previewDocuments?.[page] ?? {}
    return blobName
  }

  static getPageBySourceId = (document, sourceId) => {
    return UnifiedData.getPageBySourceId(document.unifiedData, sourceId)
  }

  static getBboxSourceIdByPage = (document, page) => {
    return UnifiedData.getBboxSourceIdByPage(document.unifiedData, page)
  }

  static getTableSourceIdByPage = (document, page) => {
    const activePageUD = document.unifiedData?.[page]

    if (!activePageUD) {
      return null
    }

    const blobUnifiedData = activePageUD.filter(({ maxRow, maxColumn }) => (
      maxRow !== undefined && maxColumn !== undefined
    ))

    const { id } = blobUnifiedData.at(-1)
    return id
  }

  static getPreviewUrl = (document, activePage) => {
    if (document.unifiedData) {
      const activePageUD = document.unifiedData?.[activePage]
      const blobUnifiedData = activePageUD.filter((d) => !!d.blobName)
      const { blobName } = blobUnifiedData[blobUnifiedData.length - 1]
      return apiMap.apiGatewayV2.v5.file.blob(blobName)
    }

    return apiMap.apiGatewayV2.v5.file.blob(document.previewDocuments?.[activePage]?.blobName)
  }

  static getProcessingBlobName = (document, activePage) => document.processingDocuments?.[activePage]?.blobName

  static getUnifiedDataBlobName = (document, page) => {
    if (!document.unifiedData) {
      return
    }
    const activePageUD = document.unifiedData[page]
    const blobUnifiedData = activePageUD.filter((d) => !!d.blobName)
    return blobUnifiedData.at(-1)?.blobName
  }

  static getPreviewUrls = (document) => {
    if (document.unifiedData) {
      return Object.values(document.unifiedData).reduce((acc, ud) => {
        const blobUnifiedData = ud.filter((d) => !!d.blobName)
        const { blobName } = blobUnifiedData[blobUnifiedData.length - 1]
        return [...acc, apiMap.apiGatewayV2.v5.file.blob(blobName)]
      }, [])
    }

    return Object.values(document.previewDocuments).map((preview) => apiMap.apiGatewayV2.v5.file.blob(preview.blobName))
  }

  static getPagesQuantity = (document) => Object.keys(document.unifiedData ?? {}).length || Object.keys(document.previewDocuments).length

  static checkExtension = (document, extension) => document.files[0].blobName.includes(extension)

  static fromDTO = (document, documentTypes) => {
    const dt = document.documentType && documentTypes.find(
      (documentType) => documentType.code === document.documentType,
    )

    return ({
      ...document,
      documentType: dt
        ? DocumentType.toPreviewEntity(dt)
        : UNKNOWN_DOCUMENT_TYPE_PREVIEW_ENTITY,
    })
  }
}

const EMPTY_DOCUMENT = new Document()

export {
  previewDocumentsShape,
  processingDocumentsShape,
  documentErrorShape,
  documentShape,
  EMPTY_DOCUMENT,
  File,
  fileShape,
  Document,
  unifiedDataShape,
}
