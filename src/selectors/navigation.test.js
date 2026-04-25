
import { FILTERS, PAGINATION, SELECTED_RECORDS } from '@/constants/navigation'
import {
  filterSelector,
  navigationSelector,
  selectionSelector,
  uiSelector,
} from './navigation'

const mockSearchParam = {
  [FILTERS]: {
    mockFilterParam: 'mockFilterParam',
  },
  [PAGINATION]: {
    mockPaginationParam: 'mockPaginationParam',
  },
  [SELECTED_RECORDS]: {
    mockSelectedRecordsParam: 'mockSelectedRecordsParam',
  },
}

jest.mock('@/utils/queryString', () => ({
  ...jest.requireActual('@/utils/queryString'),
  queryStringToSearchParams: jest.fn(() => mockSearchParam),
}))

describe('Selectors: navigation', () => {
  let state

  beforeEach(() => {
    state = {
      navigation: {
        ui: 'mockUI',
        previousPathName: '/previous',
        '/current': 'mockParams',
      },
      router: {
        location: {
          search: '',
        },
      },
    }
    jest.resetModules()
  })

  it('selector: filterSelector', () => {
    expect(filterSelector(state)).toStrictEqual({
      ...mockSearchParam[FILTERS],
      ...mockSearchParam[PAGINATION],
    })
  })

  it('selector: navigationSelector', () => {
    expect(navigationSelector(state, '/current')).toBe(state.navigation['/current'])
  })

  it('selector: navigationSelector in case of incorrect key', () => {
    expect(navigationSelector(state, 'wrongKey')).toStrictEqual({})
  })

  it('selector: selectionSelector', () => {
    expect(selectionSelector(state)).toStrictEqual(mockSearchParam[SELECTED_RECORDS])
  })

  it('selector: uiSelector', () => {
    expect(uiSelector(state)).toBe(state.navigation.ui)
  })
})
