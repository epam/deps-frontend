
import { IndexedDbService } from './IndexedDbService'

const mockGetCb = jest.fn()
const mockPutCb = jest.fn()
const mockCursor = {
  delete: jest.fn(),
  continue: jest.fn(),
  value: {
    expiresAt: Date.now() - 1000,
  },
}

jest.mock('idb', () => ({
  openDB: jest.fn(() => ({
    transaction: jest.fn(function () {
      return {
        ...this,
        objectStore: this.objectStore,
        done: Promise.resolve(),
      }
    }),
    objectStore: jest.fn(() => ({
      get: (...args) => mockGetCb(...args),
      put: (...args) => mockPutCb(...args),
      openCursor: jest.fn(() => mockCursor),
    })),
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('calls db get method when call getBlob IndexedDbService method', () => {
  const url = 'url'
  IndexedDbService.getBlob(url)
  expect(mockGetCb).nthCalledWith(1, url)
})

test('calls db put method when call saveBlob IndexedDbService method', () => {
  const url = 'test-url'
  const blob = new Blob()
  IndexedDbService.saveBlob({
    url,
    blob,
  })
  expect(mockPutCb).nthCalledWith(1, expect.objectContaining({
    url,
    blob,
  }))
})

test('calls db put method and returns response when call requestAndStore IndexedDbService method', async () => {
  const urls = ['url']
  const blob = new Blob()
  const requestCallback = jest.fn(() => Promise.resolve(({
    blob: jest.fn(() => blob),
  })))

  const result = await IndexedDbService.requestAndStore({
    urls,
    requestCallback,
  })

  expect(requestCallback).nthCalledWith(1, urls[0])
  expect(mockPutCb).nthCalledWith(1, expect.objectContaining({
    url: urls[0],
    blob,
  }))
  expect(result).toEqual({
    [urls[0]]: blob,
  })
})

test('returns cached blob when available in requestAndStore method', async () => {
  const urls = ['cached-url']
  const cachedBlob = new Blob(['cached data'])
  mockGetCb.mockResolvedValueOnce({ blob: cachedBlob })

  const requestCallback = jest.fn()

  const result = await IndexedDbService.requestAndStore({
    urls,
    requestCallback,
  })

  expect(requestCallback).not.toHaveBeenCalled()
  expect(result).toEqual({
    [urls[0]]: cachedBlob,
  })
})

test('requests and caches blob when not in cache', async () => {
  const urls = ['new-url']
  const blob = new Blob(['new data'])
  mockGetCb.mockResolvedValueOnce(undefined)

  const requestCallback = jest.fn(() => Promise.resolve({
    blob: jest.fn(() => blob),
  }))

  const result = await IndexedDbService.requestAndStore({
    urls,
    requestCallback,
  })

  expect(requestCallback).nthCalledWith(1, urls[0])
  expect(mockPutCb).nthCalledWith(1, expect.objectContaining({
    url: urls[0],
    blob,
  }))
  expect(result).toEqual({
    [urls[0]]: blob,
  })
})

test('handles multiple urls with mixed cached and non-cached blobs', async () => {
  const urls = ['cached-url', 'new-url']
  const cachedBlob = new Blob(['cached data'])
  const newBlob = new Blob(['new data'])

  mockGetCb
    .mockResolvedValueOnce({ blob: cachedBlob })
    .mockResolvedValueOnce(undefined)

  const requestCallback = jest.fn(() => Promise.resolve({
    blob: jest.fn(() => newBlob),
  }))

  const result = await IndexedDbService.requestAndStore({
    urls,
    requestCallback,
  })

  expect(requestCallback).toHaveBeenCalledTimes(1)
  expect(requestCallback).nthCalledWith(1, urls[1])
  expect(result).toEqual({
    [urls[0]]: cachedBlob,
    [urls[1]]: newBlob,
  })
})

test('reuses in-flight requests for same url', async () => {
  const url = 'same-url'
  const blob = new Blob(['data'])

  mockGetCb.mockResolvedValue(undefined)

  const requestCallback = jest.fn(() => Promise.resolve({
    blob: jest.fn(() => blob),
  }))

  const promise1 = IndexedDbService.requestAndStore({
    urls: [url],
    requestCallback,
  })

  const promise2 = IndexedDbService.requestAndStore({
    urls: [url],
    requestCallback,
  })

  await Promise.all([promise1, promise2])

  expect(requestCallback).toHaveBeenCalledTimes(1)
})

test('call db methods then call clearExpiredBlobs IndexedDbService method', async () => {
  await IndexedDbService.clearExpiredBlobs()

  expect(mockCursor.delete).toHaveBeenCalledTimes(1)
  expect(mockCursor.continue).toHaveBeenCalledTimes(1)
})

test('returns undefined when blob not found in getBlob', async () => {
  mockGetCb.mockResolvedValueOnce(undefined)

  const result = await IndexedDbService.getBlob('non-existent-url')

  expect(result).toBeUndefined()
})

test('returns blob when value has blob property in getBlob', async () => {
  const blob = new Blob(['test data'])
  mockGetCb.mockResolvedValueOnce({ blob })

  const result = await IndexedDbService.getBlob('test-url')

  expect(result).toBe(blob)
})

test('waits for pending operation and returns blob when operation is in progress', async () => {
  const url = 'pending-url'
  const blob = new Blob(['pending data'])

  mockGetCb.mockResolvedValue({ blob })

  mockPutCb.mockResolvedValue(undefined)

  const savePromise = IndexedDbService.saveBlob({
    url,
    blob,
  })
  const getPromise = IndexedDbService.getBlob(url)

  await Promise.all([savePromise, getPromise])

  const result = await getPromise

  expect(result).toBe(blob)
  expect(mockGetCb).toHaveBeenCalledWith(url)
})

test('removes pending operation after saveBlob completes successfully', async () => {
  const url = 'test-url'
  const blob = new Blob(['test data'])

  mockPutCb.mockResolvedValue(undefined)

  await IndexedDbService.saveBlob({
    url,
    blob,
  })

  expect(IndexedDbService.pendingOperations.has(url)).toBe(false)
})

test('saveBlob stores data with expiration time', async () => {
  const url = 'test-url'
  const blob = new Blob(['test data'])

  mockPutCb.mockResolvedValue(undefined)

  await IndexedDbService.saveBlob({
    url,
    blob,
  })

  expect(mockPutCb).toHaveBeenCalledWith(
    expect.objectContaining({
      url,
      blob,
      expiresAt: expect.any(Number),
    }),
  )
})

test('handles multiple concurrent getBlob calls for same pending operation', async () => {
  const url = 'concurrent-url'
  const blob = new Blob(['concurrent data'])

  mockGetCb.mockResolvedValue({ blob })

  mockPutCb.mockResolvedValue(undefined)

  const savePromise = IndexedDbService.saveBlob({
    url,
    blob,
  })
  const getPromise1 = IndexedDbService.getBlob(url)
  const getPromise2 = IndexedDbService.getBlob(url)

  await Promise.all([savePromise, getPromise1, getPromise2])

  const result1 = await getPromise1
  const result2 = await getPromise2

  expect(result1).toBe(blob)
  expect(result2).toBe(blob)
  expect(mockGetCb).toHaveBeenCalledWith(url)
})
