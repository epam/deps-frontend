
import { mockEnv } from '@/mocks/mockEnv'
import { clearDocumentStore } from '@/actions/documentReviewPage'
import {
  updateExtractedData,
  setDataByProp,
  setStatesToDocuments,
  storeDocuments,
  storeDocument,
  storeComment,
  storeValidation,
  storeFields,
  updateExtractedDataChunk,
  updateUnifiedDataTables,
} from '@/actions/documents'
import { DocumentState } from '@/enums/DocumentState'
import { EMPTY_DOCUMENT, Document } from '@/models/Document'
import { documentsReducer, initialState } from '@/reducers/documents'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

const mockDocuments = [
  new Document({ _id: 'mockDocument' }),
]

const mockState = {
  1: new Document({ id: 1 }),
  2: new Document({ id: 2 }),
  3: new Document({ id: 3 }),
  4: new Document({ id: 4 }),
}

describe('Reducer: documents', () => {
  it('Action handler: requestDocuments', () => {
    const action = storeDocuments(mockDocuments)

    const updatedEntities = { ...initialState }

    mockDocuments.forEach((document) => {
      updatedEntities[document._id] = {
        ...initialState[document._id],
        ...document,
      }
    })
    const expected = {
      ...initialState,
      ...updatedEntities,
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: storeDocument', () => {
    const state = {
      ...initialState,
      testDocumentId: {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
      },
    }

    const mockDocument = {
      _id: 'testDocumentId',
      title: 'testDocument',
    }

    const action = storeDocument(mockDocument)

    const expected = {
      ...state,
      testDocumentId: {
        ...state.testDocumentId,
        title: 'testDocument',
      },
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: setDataByProp', () => {
    const state = {
      ...initialState,
      testDocumentId: {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
      },
    }

    const action = setDataByProp({
      documentId: 'testDocumentId',
      prop: 'state',
      data: DocumentState.NEW,
    })

    const expected = {
      ...state,
      testDocumentId: {
        ...state.testDocumentId,
        state: DocumentState.NEW,
      },
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: setStatesToDocuments', () => {
    const state = {
      ...initialState,
      testDocumentId: {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
      },
    }

    const action = setStatesToDocuments([
      {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
        state: DocumentState.PREPROCESSING,
      },
    ])

    const expected = {
      ...state,
      testDocumentId: {
        ...state.testDocumentId,
        state: DocumentState.PREPROCESSING,
      },
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: updateExtractedData', () => {
    const state = {
      ...initialState,
      testDocumentId: {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
      },
    }
    const action = updateExtractedData('testDocumentId', ['testData'])

    const expected = {
      ...state,
      testDocumentId: {
        ...state.testDocumentId,
        extractedData: [
          ...(state.testDocumentId.extractedData ?? []),
          'testData',
        ],
      },
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: clearDocumentStore', () => {
    const action = {
      type: clearDocumentStore.toString(),
    }

    expect(documentsReducer(state, action)).toEqual(initialState)
  })

  it('Action handler: storeComment', () => {
    const state = {
      ...initialState,
      testDocumentId: {
        ...EMPTY_DOCUMENT,
        _id: 'testDocumentId',
      },
    }
    const action = storeComment('testDocumentId', 'comment')

    const expected = {
      ...state,
      testDocumentId: {
        ...state.testDocumentId,
        communication: {
          ...state.testDocumentId.communication,
          comments: [
            ...state.testDocumentId.communication.comments,
            'comment',
          ],
        },
      },
    }

    expect(documentsReducer(state, action)).toEqual(expected)
  })

  it('Action handler: storeValidation', () => {
    const mockValidation = {
      isValid: true,
      detail: [
        {
          fieldCode: 'code',
          documentId: '1',
        },
      ],
    }
    const action = storeValidation('1', mockValidation)

    const expected = {
      ...mockState,
      1: {
        ...mockState['1'],
        validation: mockValidation,
      },

    }

    expect(documentsReducer(mockState, action)).toEqual(expected)
  })

  it('Action handler: storeFields', () => {
    const action = storeFields('1')

    expect(documentsReducer(mockState, action)).toEqual(mockState)
  })

  it('Action handler: updateExtractedDataChunk', () => {
    const documentExtractedDataChunk = {
      meta: {
        listIndex: 0,
      },
      data: {
        cells: [[1, 2]],
      },
      tableCoordinates: [[1, 2]],
    }

    const mockState = {
      1: new Document({
        id: 1,
        extractedData: [{
          fieldPk: 2,
          data: [{
            meta: {
              listIndex: 0,
            },
          }],
        }],
      }),
    }

    const expected = {
      ...mockState,
      1: {
        ...mockState[1],
        extractedData: [{
          ...mockState[1].extractedData[0],
          data: [{
            cells: documentExtractedDataChunk.data.cells,
            meta: documentExtractedDataChunk.meta,
          }],
        }],
      },
    }
    const action = updateExtractedDataChunk(1, 2, documentExtractedDataChunk)
    expect(documentsReducer(mockState, action)).toEqual(expected)
  })

  describe('Action handler: updateUnifiedDataTables', () => {
    it('should handle ud with one table per page correctly', () => {
      const mockCells = []
      const mockDocumentId = 1
      const mockTableId = 2

      const mockState = {
        [mockDocumentId]: new Document({
          id: mockDocumentId,
          unifiedData: {
            1: [{
              page: 1,
              id: mockTableId,
            }],
          },
        }),
      }

      const expected = {
        ...mockState,
        [mockDocumentId]: {
          ...mockState[mockDocumentId],
          unifiedData: {
            ...mockState[mockDocumentId].unifiedData,
            1: [{
              ...mockState[mockDocumentId].unifiedData[1][0],
              cells: mockCells,
            }],
          },
        },
      }

      const action = updateUnifiedDataTables({
        documentId: mockDocumentId,
        tablesData: [{
          tableId: mockTableId,
          cells: mockCells,
        }],
      })

      expect(documentsReducer(mockState, action)).toEqual(expected)
    })

    it('should handle ud with more than one table per page correctly', () => {
      const mockCells = []
      const mockDocumentId = 1
      const mockTableId1 = 2
      const mockTableId2 = 3

      const mockState = {
        [mockDocumentId]: new Document({
          id: mockDocumentId,
          unifiedData: {
            1: [
              {
                page: 1,
                id: mockTableId1,
              },
              {
                page: 1,
                id: mockTableId2,
              },
            ],
          },
        }),
      }

      const expected = {
        ...mockState,
        [mockDocumentId]: {
          ...mockState[mockDocumentId],
          unifiedData: {
            ...mockState[mockDocumentId].unifiedData,
            1: [
              {
                ...mockState[mockDocumentId].unifiedData[1][0],
              },
              {
                ...mockState[mockDocumentId].unifiedData[1][1],
                cells: mockCells,
              },
            ],
          },
        },
      }

      const action = updateUnifiedDataTables({
        documentId: mockDocumentId,
        tablesData: [{
          tableId: mockTableId2,
          cells: mockCells,
        }],
      })

      expect(documentsReducer(mockState, action)).toEqual(expected)
    })
  })
})
