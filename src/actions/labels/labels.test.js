
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchLabels,
  storeLabels,
  storeLabel,
  createLabel,
} from '@/actions/labels'
import { labelsApi } from '@/api/labelsApi'

const mockResponse = 'mockResponse'
const mockGetLabelsResponse = { labels: mockResponse }

jest.mock('@/api/labelsApi', () => ({
  labelsApi: {
    getLabels: jest.fn(() => Promise.resolve(mockGetLabelsResponse)),
    createLabel: jest.fn(() => Promise.resolve(mockResponse)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchLabels', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call labelsApiService.getLabels once', async () => {
    await fetchLabels()(dispatch)
    expect(labelsApi.getLabels).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeLabels action in case of request was successful', async () => {
    await fetchLabels()(dispatch)
    expect(dispatch).nthCalledWith(2, storeLabels(mockResponse))
  })
})

describe('Action creator: createLabel', () => {
  let dispatch
  const labelName = 'newLabel'

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call labelsApiService.createLabel once', async () => {
    await createLabel(labelName)(dispatch)
    expect(labelsApi.createLabel).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeLabel action in case of request was successful', async () => {
    await createLabel(labelName)(dispatch)
    expect(dispatch).nthCalledWith(2, storeLabel(mockResponse))
  })
})
