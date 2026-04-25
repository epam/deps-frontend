
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeDocumentStates,
} from '@/actions/documentStates'
import { documentStatesReducer } from '@/reducers/documentStates'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

describe('Reducer: DocumentStates', () => {
  it('Action handler: storeDocumentStates', () => {
    const action = storeDocumentStates({
      identification: 'Identification',
      preprocessing: 'Preprocessing',
    })

    const expected = {
      identification: 'Identification',
      preprocessing: 'Preprocessing',
    }

    expect(documentStatesReducer(state, action)).toEqual(expected)
  })
})
