
import { mockEnv } from '@/mocks/mockEnv'
import { storeDocuments } from '@/actions/documents'
import {
  fetchDocumentsByFilter,
  updateDocumentsType,
  storeDocumentsIds,
} from '@/actions/documentsListPage'
import { documentsApi } from '@/api/documentsApi'
import { Document } from '@/models/Document'
import { BASE_DOCUMENTS_FILTER_CONFIG } from '@/models/DocumentsFilterConfig'

const mockData = {
  result: [new Document({ id: 'mockDocumentId' })],
  documents: [new Document({ id: 'mockDocumentId' })],
  meta: {
    total: 1,
  },
}

jest.mock('@/utils/apiRequest')
jest.mock('@/selectors/documentsListPage')
jest.mock('@/selectors/navigation')
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    removeLabel: jest.fn(),
    getDocumentList: jest.fn(() => mockData),
    assignDocumentType: jest.fn(() => mockData),
    extractData: jest.fn(() => mockData),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchDocumentsByFilter', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call documentsApi.getDocumentList once', async () => {
    await fetchDocumentsByFilter(BASE_DOCUMENTS_FILTER_CONFIG)(dispatch, getState)
    expect(documentsApi.getDocumentList).toHaveBeenCalledTimes(1)
    expect(documentsApi.getDocumentList).nthCalledWith(1, BASE_DOCUMENTS_FILTER_CONFIG)
  })
  it('should call dispatch with storeDocuments action in case of request was successful', async () => {
    await fetchDocumentsByFilter(BASE_DOCUMENTS_FILTER_CONFIG)(dispatch, getState)
    const documents = mockData.result.map((document) => ({
      ...document,
      status: document.validationStatus ? document.validationStatus.title : '',
      labels: document.labels ? document.labels : [],
    }))
    expect(dispatch).nthCalledWith(2, storeDocuments(documents))
    expect(dispatch).nthCalledWith(3, storeDocumentsIds({
      ids: documents.map((doc) => doc._id),
      total: mockData.meta.total,
    }))
  })
})

describe('Action creator: updateDocumentsType', () => {
  let dispatch
  const documentType = {
    type: 'DirectionalSurvey',
    name: 'Directional Survey',
  }
  const checkedDocuments = ['5b5b0a2a511cfd5c18d8916f']

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call documentsApi.assignDocumentType once', async () => {
    await updateDocumentsType(documentType, checkedDocuments, BASE_DOCUMENTS_FILTER_CONFIG)(dispatch)
    expect(documentsApi.assignDocumentType).toHaveBeenCalledTimes(1)
    expect(documentsApi.assignDocumentType).nthCalledWith(1, checkedDocuments, documentType)
  })
})
