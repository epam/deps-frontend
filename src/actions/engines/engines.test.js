
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeTableEngines,
  storeOCREngines,
  fetchTableEngines,
  fetchOCREngines,
} from '@/actions/engines'
import { enginesApi } from '@/api/enginesApi'
import { KnownOCREngine, RESOURCE_OCR_ENGINE } from '@/enums/KnownOCREngine'
import { Engine } from '@/models/Engine'

const mockEngines = [
  new Engine(
    KnownOCREngine.TESSERACT,
    RESOURCE_OCR_ENGINE[KnownOCREngine.TESSERACT],
  ),
]

const mockError = new Error('Mock Error Message')

jest.mock('@/api/enginesApi', () => ({
  enginesApi: {
    getEngines: jest.fn(() => Promise.resolve({ engines: mockEngines })),
    getTableEngines: jest.fn(() => Promise.resolve(mockEngines)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: getEngines', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call getEngines once', async () => {
    await fetchOCREngines()(dispatch)
    expect(enginesApi.getEngines).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch second time with enginesFetchSuccess from response in case of success', async () => {
    await fetchOCREngines()(dispatch)
    expect(dispatch).nthCalledWith(2, storeOCREngines(mockEngines))
  })

  it('should throw error', async () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    enginesApi.getEngines.mockImplementationOnce(() => Promise.reject(mockError))
    await expect(fetchOCREngines()(dispatch)).rejects.toThrowError(mockError)
  })
})

describe('Action creator: getTableEngines', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call getTableEngines once', async () => {
    await fetchTableEngines()(dispatch)
    expect(enginesApi.getTableEngines).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch second time with fetchDetectEnginesSuccess from response in case of success', async () => {
    await fetchTableEngines()(dispatch)
    expect(dispatch).nthCalledWith(2, storeTableEngines(mockEngines))
  })

  it('should throw error', async () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    enginesApi.getTableEngines.mockImplementationOnce(() => Promise.reject(mockError))
    await expect(fetchTableEngines()(dispatch)).rejects.toThrowError(mockError)
  })
})
