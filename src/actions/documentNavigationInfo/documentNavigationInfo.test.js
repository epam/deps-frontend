
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeDocumentNavigationInfo,
  initializeDocumentNavigationInfo,
  fetchDocumentsForNavigationInfo,
  updateDocumentNavigationInfo,
} from '@/actions/documentNavigationInfo'
import { documentsApi } from '@/api/documentsApi'
import { Document } from '@/models/Document'
import { documentsIdsSelector, documentsTotalSelector } from '@/selectors/documentsListPage'
import { navigationSelector } from '@/selectors/navigation'

const mockData = {
  documents: [new Document({ id: 'mockDocumentId' })],
  meta: {
    total: 1,
  },
}

jest.mock('@/selectors/documentsListPage', () => ({
  documentsIdsSelector: jest.fn(),
  documentsTotalSelector: jest.fn(),
}))
jest.mock('@/selectors/navigation')
jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    getDocumentList: jest.fn(() => mockData),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: initializeDocumentNavigationInfo', () => {
  let dispatch, getState
  const mockDocumentId = 'id1'
  const mockDocumentIds = ['id0', mockDocumentId, 'id2', 'id3']
  const mockTotal = 3
  const navigation = navigationSelector.getSelectorMockValue()

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
    documentsIdsSelector.mockReturnValue(mockDocumentIds)
    documentsTotalSelector.mockReturnValue(mockTotal)
  })

  it('should call dispatch with storeDocumentNavigationInfo action', async () => {
    await initializeDocumentNavigationInfo(mockDocumentId)(dispatch, getState)

    expect(dispatch).nthCalledWith(1, storeDocumentNavigationInfo({
      currentDocIndex: mockDocumentIds.indexOf(mockDocumentId),
      documentIds: mockDocumentIds,
      pagination: navigation.pagination,
      total: mockTotal,
    }))
  })
})

describe('Action creator: fetchDocumentsForNavigationInfo', () => {
  let dispatch, getState
  const navigation = navigationSelector.getSelectorMockValue()

  const filters = {
    ...navigation.filters,
    title: 'test',
  }

  const pagination = {
    page: 2,
    prPage: 20,
  }

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
    jest.clearAllMocks()

    navigationSelector.mockReturnValueOnce({
      ...navigation,
      filters,
    })
  })

  it('should call documentsApi.getDocumentList once', async () => {
    await fetchDocumentsForNavigationInfo(pagination)(dispatch, getState)

    expect(documentsApi.getDocumentList).nthCalledWith(1, {
      ...filters,
      ...pagination,
    })
  })

  it('should call dispatch with updateDocumentNavigationInfo action', async () => {
    await fetchDocumentsForNavigationInfo(pagination)(dispatch, getState)

    expect(dispatch).nthCalledWith(1, updateDocumentNavigationInfo({
      documentIds: mockData.documents.map((doc) => doc._id),
      total: mockData.meta.total,
    }))
  })

  it('should not dispatch updateDocumentNavigationInfo action if no documents received', async () => {
    documentsApi.getDocumentList.mockReturnValueOnce({
      documents: [],
      meta: { total: 0 },
    })

    await fetchDocumentsForNavigationInfo(pagination)(dispatch, getState)

    expect(dispatch).not.toHaveBeenCalled()
  })
})
