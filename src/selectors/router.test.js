
import {
  searchSelector,
  searchParamsSelector,
  pathNameSelector,
} from './router'

jest.mock('@/utils/queryString', () => ({
  ...jest.requireActual('@/utils/queryString'),
  queryStringToSearchParams: jest.fn(() => 'mockParams'),
}))

describe('Selectors: router', () => {
  let state

  beforeEach(() => {
    state = {
      router: {
        location: {
          search: 'mockSearch',
          pathname: 'mockPath',
        },
      },
    }
  })

  it('selector: searchSelector', () => {
    expect(searchSelector(state)).toBe(state.router.location.search)
  })

  it('selector: searchParamsSelector', () => {
    expect(searchParamsSelector(state)).toBe('mockParams')
  })

  it('selector: pathNameSelector', () => {
    expect(pathNameSelector(state)).toBe(state.router.location.pathname)
  })
})
