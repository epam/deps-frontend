
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeSystemVersion,
  storeTableColumns,
} from '@/actions/system'
import { systemReducer } from './system'

jest.mock('@/utils/env', () => mockEnv)

const unknownAction = {
  type: 'UNKNOWN_ACTION_TYPE',
}

describe('Reducer: system', () => {
  let state

  beforeAll(() => {
    state = {}
  })

  it('should return correct initial state', () => {
    expect(systemReducer(undefined, unknownAction)).toEqual(state)
  })

  it('should correctly handle unknown action', () => {
    expect(systemReducer(state, unknownAction)).toEqual(state)
  })

  it('should correctly handle systemVersionFetchSuccess action and replace build field of the state with the action payload', () => {
    const action = storeSystemVersion({
      buildDate: '2020-01-01',
      commitHash: '12345',
    })
    expect(systemReducer(state, action)).toEqual({
      ...state,
      ...action.payload,
    })
  })

  it('should correctly handle storeTableColumns action', () => {
    const action = storeTableColumns({
      col1: 'col1',
      col2: 'col2',
    })
    expect(systemReducer(state, action)).toEqual({
      ...state,
      tableColumns: action.payload,
    })
  })
})
