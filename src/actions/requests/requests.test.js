
import { mockEnv } from '@/mocks/mockEnv'
import { mockSessionStorageWrapper } from '@/mocks/mockSessionStorageWrapper'
import {
  requestAttempt,
  requestSuccess,
  requestFailure,
  createRequestAction,
} from '@/actions/requests'
import { POST_SIGN_IN_REDIRECT_URL } from '@/constants/storage'
import { StatusCode } from '@/enums/StatusCode'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/sessionStorageWrapper', () => mockSessionStorageWrapper('mockUrl'))

const mockUrl = 'mockUrl'

Object.defineProperty(window, 'location', {
  value: { href: mockUrl },
})

const mockActionName = 'mockActionName'
const mockError = new Error('Mock Error Message')

describe('Actions: requests', () => {
  it('should create requestAttempt action with correct type and payload', () => {
    const action = requestAttempt(mockActionName)
    expect(action).toEqual({
      type: requestAttempt.toString(),
      payload: mockActionName,
    })
  })

  it('should create requestSuccess action with correct type and payload', () => {
    const action = requestSuccess(mockActionName)
    expect(action).toEqual({
      type: requestSuccess.toString(),
      payload: mockActionName,
    })
  })

  it('should create requestFailure action with correct type and payload', () => {
    const action = requestFailure(mockActionName, mockError.message)
    expect(action).toEqual({
      type: requestFailure.toString(),
      payload: {
        requestId: mockActionName,
        error: mockError.message,
      },
    })
  })

  describe('createRequestAction', () => {
    let dispatch
    let getState
    let requestId
    let actionCreator
    let errorHandler
    let mockArg1
    let mockArg2
    let requestActionCreator
    let returnedMockActionCreator

    beforeEach(() => {
      returnedMockActionCreator = jest.fn(() => Promise.resolve({}))
      dispatch = jest.fn()
      getState = jest.fn()
      actionCreator = jest.fn(() => returnedMockActionCreator)
      errorHandler = jest.fn()
      requestId = 'mockRequestId'
      mockArg1 = 'mockArg1'
      mockArg2 = 'mockArg2'
      requestActionCreator = createRequestAction(requestId, actionCreator, errorHandler)
    })

    it('should return requestActionCreator that have custom toString method that returns requestId', () => {
      expect(requestActionCreator.toString()).toEqual(requestId)
    })

    it('should call dispatch first time with correct argument', async () => {
      await requestActionCreator(mockArg1, mockArg2)(dispatch, getState)
      expect(dispatch).nthCalledWith(1, requestAttempt(requestId))
    })

    it('should call dispatch second time with correct argument in case success', async () => {
      await requestActionCreator(mockArg1, mockArg2)(dispatch, getState)
      expect(dispatch).nthCalledWith(2, requestSuccess(requestId))
    })

    it('should call actionCreator with correct arguments and pass dispatch and getState to returned actionCreator', async () => {
      await requestActionCreator(mockArg1, mockArg2)(dispatch, getState)
      expect(actionCreator).nthCalledWith(1, mockArg1, mockArg2)
      expect(returnedMockActionCreator).nthCalledWith(1, dispatch, getState)
    })

    it('should call errorHandler with correct argument', async () => {
      console.warn = jest.fn()
      console.error = jest.fn()
      returnedMockActionCreator.mockImplementationOnce(() => Promise.reject(mockError))
      await requestActionCreator(mockArg1, mockArg2)(dispatch, getState)
      expect(errorHandler).nthCalledWith(1, mockError)
    })

    it('should call sessionStorageWrapper.setItem with correct arguments', async () => {
      console.warn = jest.fn()
      console.error = jest.fn()
      const mockError = new Error('Mock Error Message')
      mockError.response = {
        data: {},
        status: StatusCode.UNAUTHORIZED,
      }
      returnedMockActionCreator.mockImplementationOnce(() => Promise.reject(mockError))
      await requestActionCreator(mockArg1, mockArg2)(dispatch, getState)
      expect(sessionStorageWrapper.setItem).nthCalledWith(1, POST_SIGN_IN_REDIRECT_URL, mockUrl)
    })
  })
})
