
import { mockEnv } from '@/mocks/mockEnv'
import { FileStaticCache } from './FileStaticCache'

jest.mock('@/utils/apiRequest')
jest.mock('@/utils/env', () => mockEnv)

const mockDbService = {
  requestAndStore: jest.fn(),
  saveBlob: jest.fn(),
  getBlob: jest.fn(),
}

test('calls saveBlob db service method with correct args when call store instance method', () => {
  const key = 'test-url'
  const value = new Blob()
  const instance = new FileStaticCache(mockDbService)
  instance.store(key, value)

  expect(mockDbService.saveBlob).nthCalledWith(1, {
    url: key,
    blob: value,
  })
})

test('calls requestAndStore db service method with correct args when call requestAndStore instance method', () => {
  const urls = ['one']
  const instance = new FileStaticCache(mockDbService)
  instance.requestAndStore(urls)

  expect(mockDbService.requestAndStore).nthCalledWith(1, {
    urls,
    requestCallback: expect.any(Function),
  })
})

test('calls getBlob db service method with correct args when call get instance method', () => {
  const url = 'one'
  const instance = new FileStaticCache(mockDbService)
  instance.get(url)

  expect(mockDbService.getBlob).nthCalledWith(1, url)
})
