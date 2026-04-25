
import { mockEnv } from '@/mocks/mockEnv'
import {
  storeCurrentDocIndex,
  storePagination,
  storeDocumentNavigationInfo,
  updateDocumentNavigationInfo,
  clearDocumentNavigationInfo,
} from '@/actions/documentNavigationInfo'
import { documentNavigationInfoReducer, initialState } from '@/reducers/documentNavigationInfo'

jest.mock('@/utils/env', () => mockEnv)

const state = undefined

describe('Reducer: documentNavigationInfoReducer', () => {
  it('Action handler: storeCurrentDocIndex', () => {
    const currentDocIndex = 1
    const action = storeCurrentDocIndex(currentDocIndex)

    const expected = {
      ...initialState,
      currentDocIndex,
    }

    expect(documentNavigationInfoReducer(state, action)).toEqual(expected)
  })

  it('Action handler: storePagination', () => {
    const pagination = {
      page: 1,
      perPage: 10,
    }
    const action = storePagination(pagination)

    const expected = {
      ...initialState,
      pagination,
    }

    expect(documentNavigationInfoReducer(state, action)).toEqual(expected)
  })

  it('Action handler: storeDocumentNavigationInfo', () => {
    const currentDocIndex = 1
    const documentIds = ['id1']
    const total = 1
    const pagination = {
      page: 1,
      perPage: 10,
    }

    const action = storeDocumentNavigationInfo({
      currentDocIndex,
      documentIds,
      pagination,
      total,
    })

    const expected = {
      currentDocIndex,
      documentIds,
      pagination,
      total,
    }

    expect(documentNavigationInfoReducer(state, action)).toEqual(expected)
  })

  it('Action handler: updateDocumentNavigationInfo', () => {
    const documentIds = ['id1']
    const total = 1

    const action = updateDocumentNavigationInfo({
      documentIds,
      total,
    })

    const expected = {
      ...initialState,
      documentIds,
      total,
    }

    expect(documentNavigationInfoReducer(state, action)).toEqual(expected)
  })

  it('Action handler: clearDocumentNavigationInfo', () => {
    const documentIds = ['id1']
    const total = 1

    const updateAction = updateDocumentNavigationInfo({
      documentIds,
      total,
    })
    const clearAction = clearDocumentNavigationInfo()

    const expected = {
      ...initialState,
      documentIds,
      total,
    }

    expect(documentNavigationInfoReducer(state, updateAction)).toEqual(expected)
    expect(documentNavigationInfoReducer(state, clearAction)).toEqual(initialState)
  })
})
