
import { mockEnv } from '@/mocks/mockEnv'
import { requestAttempt, requestSuccess, requestFailure } from '@/actions/requests'
import { requestsReducer } from './requests'

jest.mock('@/utils/env', () => mockEnv)

const mockAction = {
  type: 'ANY_ACTION',
}

describe('Reducer: requests', () => {
  let defaultState = {
    pending: [],
    errors: [],
  }

  beforeEach(() => {
    defaultState = requestsReducer(defaultState, mockAction)
  })

  it('should create correct default state object', () => {
    expect(defaultState).toEqual(defaultState)
  })

  it('should handle requestAttempt action correctly', () => {
    const mockActionName1 = 'mockActionName1'
    const mockActionName2 = 'mockActionName2'
    const state = {
      ...defaultState,
      pending: [mockActionName1],
    }
    const action = requestAttempt(mockActionName2)

    expect(requestsReducer(state, action)).toEqual({
      ...defaultState,
      pending: [mockActionName1, mockActionName2],
    })
  })

  it('should handle requestSuccess action correctly', () => {
    const mockActionName1 = 'mockActionName1'
    const mockActionName2 = 'mockActionName2'
    const state = {
      ...defaultState,
      pending: [mockActionName1, mockActionName2],
    }
    const action = requestSuccess(mockActionName2)

    expect(requestsReducer(state, action)).toEqual({
      ...defaultState,
      pending: [mockActionName1],
    })
  })

  it('should handle requestFailure action correctly', () => {
    const mockActionName1 = 'mockActionName1'
    const mockActionName2 = 'mockActionName2'
    const mockErrorMessage = 'Mock Error message'

    const state = {
      ...defaultState,
      pending: [mockActionName1, mockActionName2],
    }

    const action = requestFailure(mockActionName2, mockErrorMessage)

    expect(requestsReducer(state, action)).toEqual({
      ...defaultState,
      pending: [mockActionName1],
      errors: [{
        requestId: mockActionName2,
        error: mockErrorMessage,
      }],
    })
  })
})
