
import { mockEnv } from '@/mocks/mockEnv'
import { storeDocumentType } from '@/actions/documentType'
import { storeDocumentTypes } from '@/actions/documentTypes'
import { DocumentType } from '@/models/DocumentType'
import { documentTypesListPageReducer, initialState } from '@/reducers/documentTypesListPage'

jest.mock('@/utils/env', () => mockEnv)

const mockDocumentTypes = [
  new DocumentType('documentType1'),
  new DocumentType('documentType2'),
  new DocumentType('documentType3'),
]

describe('Reducer: documentTypes', () => {
  describe('Action handler: storeDocumentType', () => {
    it('should add new document type to the state object', () => {
      const [first] = mockDocumentTypes
      const stateBefore = { ...initialState }

      const expectedStateAfter = {
        ...initialState,
        ids: [...stateBefore.ids, first.code],
      }

      const action = storeDocumentType(first)
      const stateAfter = documentTypesListPageReducer(stateBefore, action)
      expect(stateAfter).toEqual(expectedStateAfter)
    })
  })

  describe('Action handler: storeDocumentTypes', () => {
    it('should put fetched types to the state', () => {
      const stateBefore = { ...initialState }

      const action = storeDocumentTypes(mockDocumentTypes)

      const expectedStateAfter = {
        ...stateBefore,
        ids: mockDocumentTypes.map((type) => type.code),
      }

      const stateAfter = documentTypesListPageReducer(stateBefore, action)
      expect(stateAfter).toEqual(expectedStateAfter)
    })
  })
})
