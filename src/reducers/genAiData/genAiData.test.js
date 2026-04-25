
import { mockEnv } from '@/mocks/mockEnv'
import { storeFields } from '@/actions/genAiData'
import { genAiDataReducer } from './genAiData'

jest.mock('@/utils/env', () => mockEnv)

const initialState = {}

describe('Reducer: genAiData', () => {
  it('Action handler: storeFields', () => {
    const mockDocumentId = 1
    const mockFields = [{
      key: 'mockKey',
    }]
    const actionPayload = {
      documentId: mockDocumentId,
      fields: mockFields,
    }

    const expected = {
      [mockDocumentId]: mockFields,
    }
    const action = storeFields(actionPayload)
    expect(genAiDataReducer(initialState, action)).toEqual(expected)
  })
})
