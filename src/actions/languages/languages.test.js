
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchAvailableLanguages,
  storeLanguages,
} from '@/actions/languages'
import { languagesApi } from '@/api/languagesApi'

const mockResponse = { languages: 'mockLanguages' }
const mockError = new Error('Mock Error Message')

jest.mock('@/api/languagesApi', () => ({
  languagesApi: {
    getAvailableLanguages: jest.fn(() => Promise.resolve(mockResponse)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchAvailableLanguages', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
    jest.clearAllMocks()
  })

  it('should call getAvailableLanguages once', async () => {
    await fetchAvailableLanguages()(dispatch)
    expect(languagesApi.getAvailableLanguages).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch second time with languagesFetchSuccess from response in case of success', async () => {
    await fetchAvailableLanguages()(dispatch)
    expect(dispatch).nthCalledWith(2, storeLanguages(mockResponse.languages))
  })

  it('should throw error', async () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    languagesApi.getAvailableLanguages.mockImplementationOnce(() => Promise.reject(mockError))
    await expect(fetchAvailableLanguages()(dispatch)).rejects.toThrowError(mockError)
  })
})
