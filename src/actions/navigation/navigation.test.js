
import { SELECTED_RECORDS, FILTERS, PAGINATION, DocumentFilterKeys, PaginationKeys } from '@/constants/navigation'
import { navigationSelector } from '@/selectors/navigation'
import { pathNameSelector } from '@/selectors/router'
import { history } from '@/utils/history'
import { navigationMap } from '@/utils/navigationMap'
import {
  goTo,
  setSelection,
  setPagination,
  setScrollId,
  setFilters,
} from '.'

jest.mock('@/utils/history', () => ({
  history: {
    push: jest.fn(),
  },
}))
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/router')

describe('Action creator: setFilters', () => {
  const mockFilters = { mock: 'mock' }
  let dispatch, getState
  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call pathNameSelector once', () => {
    setFilters({ mockFilters })(dispatch, getState)
    expect(pathNameSelector).nthCalledWith(1, getState())
  })

  it('should call dispatch once', () => {
    setFilters({ mockFilters })(dispatch, getState)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('Action creator: setPagination', () => {
  const mockPagination = { mock: 'mock' }

  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call pathNameSelector once', () => {
    setPagination({ mockPagination })(dispatch, getState)
    expect(pathNameSelector).nthCalledWith(1, getState())
  })

  it('should call dispatch once', () => {
    setPagination({ mockPagination })(dispatch, getState)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('Action creator: setSelection', () => {
  const mockSelection = { mock: 'mock' }

  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call pathNameSelector once', () => {
    setSelection({ mockSelection })(dispatch, getState)
    expect(pathNameSelector).nthCalledWith(1, getState())
  })

  it('should call dispatch once', () => {
    setSelection({ mockSelection })(dispatch, getState)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('Action creator: setScrollId', () => {
  const mockId = 'mockId'

  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
  })

  it('should call dispatch once', () => {
    setScrollId(mockId)(dispatch, getState)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })
})

describe('Action creator: goTo', () => {
  const mockConfig = {
    [FILTERS]: {
      [DocumentFilterKeys.TITLE]: ['mock'],
    },
    [PAGINATION]: {
      [PaginationKeys.PAGE]: 2,
      [PaginationKeys.PER_PAGE]: 20,
    },
    [SELECTED_RECORDS]: ['1', '2'],
  }
  const mockPathName = navigationMap.documents()

  let dispatch, getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
  })

  it('should call navigationSelector once', () => {
    goTo(mockPathName, mockConfig)(dispatch, getState)
    expect(navigationSelector).nthCalledWith(1, getState(), mockPathName)
  })

  it('should call history.push once with correct url', () => {
    goTo(mockPathName, mockConfig)(dispatch, getState)
    expect(history.push).nthCalledWith(
      1,
      '/documents?filters=%7B%22title%22%3A%5B%22mock%22%5D%7D&pagination=%7B%22page%22%3A2%2C%22perPage%22%3A20%7D&selection=%5B%221%22%2C%222%22%5D',
    )
  })
})
