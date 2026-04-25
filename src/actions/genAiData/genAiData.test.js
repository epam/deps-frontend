
import { mockEnv } from '@/mocks/mockEnv'
import {
  createField,
  fetchGenAiFields,
  updateField,
  deleteFields,
  storeFields,
} from '@/actions/genAiData'
import {
  getGenAiFields,
  createGenAiField,
  updateGenAiField,
  deleteGenAiFields,
} from '@/api/prompterApi'
import { GenAiField } from '@/models/GenAiField'
import { idSelector } from '@/selectors/documentReviewPage'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')

jest.mock('@/api/prompterApi', () => ({
  createGenAiField: jest.fn(() => Promise.resolve()),
  deleteGenAiFields: jest.fn(() => Promise.resolve()),
  getGenAiFields: jest.fn(() => Promise.resolve(mockFieldsListResponse)),
  updateGenAiField: jest.fn(() => Promise.resolve()),
}))

const mockFieldsListResponse = {
  keyValues: [
    new GenAiField({
      key: 'mockKey',
      value: 'mockValue',
      id: 'mockId',
    })],
}

describe('Action creator: fetchGenAiFields', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call getGenAiFields once with correct argument', async () => {
    const id = idSelector.getSelectorMockValue()
    await fetchGenAiFields()(dispatch, getState)

    expect(getGenAiFields).toHaveBeenCalledTimes(1)
    expect(getGenAiFields).nthCalledWith(1, id)
  })

  it('should call dispatch with storeFields action', async () => {
    const mockId = idSelector.getSelectorMockValue()
    await fetchGenAiFields()(dispatch, getState)
    expect(dispatch).nthCalledWith(2, storeFields({
      documentId: mockId,
      fields: mockFieldsListResponse.keyValues,
    }))
  })
})

describe('Action creator: createField', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call createGenAiField once with correct arguments', async () => {
    const mockFieldData = {
      key: 'mock-k',
      value: 'mock-v',
    }
    const mockDocId = idSelector.getSelectorMockValue()
    await createField(mockFieldData)(dispatch, getState)

    expect(createGenAiField).nthCalledWith(1, mockDocId, mockFieldData)
  })
})

describe('Action creator: updateField', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call updateGenAiField once with correct arguments', async () => {
    const mockFieldData = new GenAiField({
      key: 'mock-k',
      value: 'mock-v',
      id: 'mockId',
    })
    const mockDocId = idSelector.getSelectorMockValue()
    await updateField(mockFieldData)(dispatch, getState)

    expect(updateGenAiField).toHaveBeenCalledTimes(1)
    expect(updateGenAiField).nthCalledWith(1, mockDocId, mockFieldData)
  })
})

describe('Action creator: deleteFields', () => {
  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call deleteGenAiFields once with correct arguments', async () => {
    const ids = ['id1']
    const mockDocId = idSelector.getSelectorMockValue()
    await deleteFields(ids)(dispatch, getState)

    expect(deleteGenAiFields).toHaveBeenCalledTimes(1)
    expect(deleteGenAiFields).nthCalledWith(1, mockDocId, { ids })
  })
})
