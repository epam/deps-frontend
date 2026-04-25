
import { mockEnv } from '@/mocks/mockEnv'
import {
  fetchDocumentStates,
  storeDocumentStates,
} from '@/actions/documentStates'
import { documentStatesApi } from '@/api/documentStatesApi'

const mockDocumentStates = {
  preprocessing: {
    title: 'Preprocessing',
    name: 'preprocessing',
  },
  identification: {
    title: 'Identification',
    name: 'identification',
  },
}

jest.mock('@/api/documentStatesApi', () => ({
  documentStatesApi: {
    getDocumentStates: jest.fn(() => Promise.resolve(mockDocumentStates)),
  },
}))
jest.mock('@/utils/env', () => mockEnv)

describe('Action creator: fetchDocumentStates', () => {
  let dispatch

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call getDocumentStates once', async () => {
    await fetchDocumentStates()(dispatch)
    expect(documentStatesApi.getDocumentStates).toHaveBeenCalledTimes(1)
  })

  it('should call dispatch with storeDocumentStates action in case of request was successful', async () => {
    await fetchDocumentStates()(dispatch)
    expect(dispatch).nthCalledWith(2, storeDocumentStates({
      identification: 'Identification',
      preprocessing: 'Preprocessing',
    }))
  })
})
