
import { mockEnv } from '@/mocks/mockEnv'
import { storeDocumentsIds } from '@/actions/documentsListPage'
import { documentsListPageReducer, initialState } from '@/reducers/documentsListPage'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

describe('Reducer: documents', () => {
  it('Action handler: requestDocuments', () => {
    const action = storeDocumentsIds({
      ids: [
        '1409',
      ],
      total: 1,
    })

    const expected = {
      ...initialState,
      ids: [
        '1409',
      ],
      total: 1,
    }

    expect(documentsListPageReducer(state, action)).toEqual(expected)
  })
})
