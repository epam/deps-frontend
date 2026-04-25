
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeSystemVersion,
  fetchBuildVersion,
  fetchTableColumns,
  storeTableColumns,
  saveTableColumns,
} from '@/actions/system'
import { systemApi } from '@/api/systemApi'

const mockResponse = {
  buildDate: '2020-02-04',
  commitHash: '2888',
}

const mock = Promise.resolve()

jest.mock('@/api/systemApi', () => ({
  systemApi: {
    getBuildVersion: jest.fn(() => Promise.resolve(mockResponse)),
    getTableColumns: jest.fn(() => Promise.resolve(mock)),
    saveTableColumns: jest.fn(() => Promise.resolve()),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchBuildVersion', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call systemApi.getBuildVersion once', async () => {
    await fetchBuildVersion()(dispatch)
    expect(systemApi.getBuildVersion).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeSystemVersion action in case of request was successful', async () => {
    await fetchBuildVersion()(dispatch)
    expect(dispatch).nthCalledWith(2, storeSystemVersion(mockResponse))
  })
})

describe('Action creator: fetchTableColumns', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call systemApi.getTableColumns once', async () => {
    await fetchTableColumns()(dispatch)
    expect(systemApi.getTableColumns).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeTableColumns action in case of request was successful', async () => {
    await fetchTableColumns()(dispatch)
    expect(dispatch).nthCalledWith(2, storeTableColumns(mock))
  })
})

describe('Action creator: saveTableColumns', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call systemApi.saveTableColumns once', async () => {
    await saveTableColumns()(dispatch)
    expect(systemApi.saveTableColumns).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeTableColumns action in case of request was successful', async () => {
    await saveTableColumns()(dispatch)
    expect(dispatch).nthCalledWith(2, storeTableColumns())
  })
})
