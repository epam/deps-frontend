
import { mockEnv } from '@/mocks/mockEnv'
import {
  addLabel,
  removeLabel,
  fetchDocumentData,
  extractData,
  deleteDocuments,
  saveDocumentData,
  storeDocument,
  fetchDocument,
  setInitialDocumentData,
  fetchUnifiedDataCells,
  updateUnifiedDataTables,
} from '@/actions/documents'
import { documentsApi } from '@/api/documentsApi'
import { Document } from '@/models/Document'
import { TableField, Cell } from '@/models/ExtractedData'
import { Rect } from '@/models/Rect'

const mockDeleteDocumentsResponse = {
  deletedDocumentKeys: [
    new Document({ id: 'mockDocumentId' }),
  ],
}

const mockDocuments = [
  new Document({ id: 'mockDocumentId1' }),
  new Document({ id: 'mockDocumentId2' }),
]

const mockDocument = new Document({ id: 'mockDocumentId' })

const mockDocumentsIds = mockDocuments.map((doc) => doc.id)

const mockNormalizedResponse = {
  entities: {
    [mockDocuments[0].id]: mockDocuments[0],
    [mockDocuments[1].id]: mockDocuments[1],
  },
}

const mockCells = []

jest.mock('@/selectors/documents')
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/router')
jest.mock('@/selectors/documentTypes')
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    addLabel: jest.fn(() => mockDocuments),
    removeLabel: jest.fn(),
    extractData: jest.fn(() => mockNormalizedResponse),
    deleteDocuments: jest.fn(() => mockDeleteDocumentsResponse),
    getDocumentWithoutExtraction: jest.fn(() => Promise.resolve(mockDocument)),
    getUnifiedDataTableCells: jest.fn(() => Promise.resolve(mockCells)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: addLabel', () => {
  let dispatch, getState
  const labelId = 'mockLabelId'
  const checkedDocuments = ['5b5b0a2a511cfd5c18d8916f']

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.addLabel once', async () => {
    await addLabel(labelId, checkedDocuments)(dispatch, getState)
    expect(documentsApi.addLabel).toHaveBeenCalledTimes(1)
    expect(documentsApi.addLabel).nthCalledWith(1, labelId, checkedDocuments)
  })
})

describe('Action creator: removeLabel', () => {
  let dispatch, getState
  const labelId = 'mockLabelId'
  const documentId = ['5b5b0a2a511cfd5c18d8916f']

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.removeLabel once', async () => {
    await removeLabel(labelId, documentId)(dispatch, getState)
    expect(documentsApi.removeLabel).toHaveBeenCalledTimes(1)
    expect(documentsApi.removeLabel).nthCalledWith(1, labelId, documentId)
  })
})

// TODO: #2232
describe('Action creator: fetchDocumentData', () => {
  let dispatch, getState
  const mockId = 'testId'
  const mockWithoutPagination = true

  const mockData = {
    extractedData: [
      new TableField(1, 'code1', [{ y: 0 }], [{ x: 0 }], [new Cell(0, 0, '123')], new Rect(0.1, 0.2, 0.3, 0.4)),
    ],
    previewDocuments: {
      1: 'https://usaz02devprism003sa.blob.core.windows.net/files/78400/images/1.png',
      2: 'https://usaz02devprism003sa.blob.core.windows.net/files/78400/images/2.png',
      3: 'https://usaz02devprism003sa.blob.core.windows.net/files/78400/images/3.png',
    },
    documentMetadata: {
      file: {
        accountName: 'usaz02devprism003sa',
        blobName: '75494.pdf',
        containerName: 'files',
      },
    },
  }

  documentsApi.getDocument = jest.fn(() => {
    return mockData
  })

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.getDocument once', async () => {
    await fetchDocumentData(mockId, mockWithoutPagination)(dispatch, getState)
    expect(documentsApi.getDocument).toHaveBeenCalledTimes(1)
    expect(documentsApi.getDocument).nthCalledWith(1, mockId, mockWithoutPagination)
  })
})

describe('Action creator: extractData', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.extractData once', async () => {
    const mockEngineCode = 'mockEngineCode'
    await extractData(mockDocumentsIds, mockEngineCode)(dispatch, getState)
    expect(documentsApi.extractData).toHaveBeenCalledTimes(1)
    expect(documentsApi.extractData).nthCalledWith(1, mockDocumentsIds, mockEngineCode)
  })
})

describe('Action creator: deleteDocuments', () => {
  let dispatch, getState
  const mockDocumentIds = ['mockID1', 'mockID2']

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.deleteDocuments once', async () => {
    await deleteDocuments(mockDocumentIds)(dispatch, getState)
    expect(documentsApi.deleteDocuments).toHaveBeenCalledTimes(1)
    expect(documentsApi.deleteDocuments).nthCalledWith(1, mockDocumentIds)
  })
})

describe('Action creator: saveDocumentData', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should dispatch with correct args', async () => {
    await saveDocumentData(mockDocument)(dispatch)
    expect(dispatch).nthCalledWith(1, setInitialDocumentData(mockDocument))
    expect(dispatch).nthCalledWith(2, storeDocument(mockDocument))
  })

  it('should dispatch with correct args in case of document without communication prop', async () => {
    const mockDocumentWithoutCommunication = new Document({ id: 'mockDocumentId' })
    mockDocumentWithoutCommunication.communication = undefined
    await saveDocumentData(mockDocumentWithoutCommunication)(dispatch)
    expect(dispatch).nthCalledWith(1, setInitialDocumentData(mockDocument))
    expect(dispatch).nthCalledWith(2, storeDocument(mockDocument))
  })

  it('should dispatch with correct args in case of communication prop without comment prop', async () => {
    const mockDocumentWithoutCommunicationComments = new Document({ id: 'mockDocumentId' })
    mockDocumentWithoutCommunicationComments.communication.comments = undefined
    await saveDocumentData(mockDocumentWithoutCommunicationComments)(dispatch)
    expect(dispatch).nthCalledWith(1, setInitialDocumentData(mockDocument))
    expect(dispatch).nthCalledWith(2, storeDocument(mockDocument))
  })
})

describe('Action creator: fetchDocument', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call documentsApi.getDocumentWithoutExtraction', async () => {
    await fetchDocument('id')(dispatch)
    expect(documentsApi.getDocumentWithoutExtraction).nthCalledWith(1, 'id')
  })
})

describe('Action creator: fetchUnifiedDataCells', () => {
  let dispatch

  const docId = 'docId'
  const tableId = 'tableId'
  const config = {}

  beforeEach(() => {
    dispatch = jest.fn()
    documentsApi.getUnifiedDataTableCells.mockClear()
  })

  it('should call documentsApi.getUnifiedDataTableCells', async () => {
    await fetchUnifiedDataCells({
      documentId: docId,
      tableConfigs: [{
        tableId: tableId,
        tableConfig: config,
      }],
    })(dispatch)
    expect(documentsApi.getUnifiedDataTableCells).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with correct arguments', async () => {
    await fetchUnifiedDataCells({
      documentId: docId,
      tableConfigs: [{
        tableId: tableId,
        tableConfig: config,
      }],
    })(dispatch)

    expect(dispatch).nthCalledWith(2, updateUnifiedDataTables({
      documentId: docId,
      tablesData: [{
        tableId: tableId,
        cells: mockCells,
      }],
    }))
  })

  it('should process tables in multiple batches when exceeding batch size', async () => {
    const tableConfigs = Array.from({ length: 25 }, (_, i) => ({
      tableId: `table${i + 1}`,
      maxRow: 10,
      maxColumn: 5,
    }))

    await fetchUnifiedDataCells({
      documentId: docId,
      tableConfigs,
    })(dispatch)

    expect(documentsApi.getUnifiedDataTableCells).toHaveBeenCalledTimes(25)

    const dispatchCall = dispatch.mock.calls.find(
      (call) => call[0].type === updateUnifiedDataTables.toString(),
    )
    expect(dispatchCall[0].payload.tablesData).toHaveLength(25)
  })
})
