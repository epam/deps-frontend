
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchMe,
  storeUser,
} from '@/actions/authorization'
import { iamApi } from '@/api/iamApi'
import { Organisation } from '@/models/Organisation'
import { User } from '@/models/User'

const mockUser = new User(
  'system@email.com',
  'Test',
  'Tester',
  new Organisation(
    '1111',
    'TestOrganisation',
    'http://host/customization.js',
  ),
  'SystemUser',
)

const mockError = new Error('Mock Error Message')

jest.mock('@/api/iamApi', () => ({
  iamApi: {
    getMe: jest.fn(() => Promise.resolve(mockUser)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchMe', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
    jest.clearAllMocks()
  })

  it('should call getMe once', async () => {
    await fetchMe()(dispatch)
    expect(iamApi.getMe).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with user from response in case of success', async () => {
    await fetchMe()(dispatch)
    expect(dispatch).nthCalledWith(2, storeUser(mockUser))
  })

  it('should return user in case of successful response', async () => {
    const user = await fetchMe()(dispatch)
    expect(user).toEqual(mockUser)
  })

  it('should throw error if getMe rejected', async () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    iamApi.getMe.mockImplementationOnce(() => Promise.reject(mockError))
    await expect(fetchMe()(dispatch)).rejects.toThrowError(mockError)
  })
})
