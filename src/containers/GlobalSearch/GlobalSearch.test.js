
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { setFilters } from '@/actions/navigation'
import { DocumentFilterKeys } from '@/constants/navigation'
import { SearchInput } from '@/containers/SearchInput'
import { filterSelector } from '@/selectors/navigation'
import { GlobalSearch } from './GlobalSearch'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/navigation')
jest.mock('@/actions/navigation', () => ({
  setFilters: jest.fn(),
}))
jest.mock('@/utils/env', () => mockEnv)

const { filters: mockFilters } = filterSelector.getSelectorMockValue()

const {
  ConnectedComponent,
  mapStateToProps,
  mapDispatchToProps,
} = GlobalSearch

describe('Container: GlobalSearch', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      setFilters: jest.fn(),
      searchFilter: mockFilters[DocumentFilterKeys.SEARCH],
    }

    wrapper = shallow(<ConnectedComponent {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setFilters prop with the correct value in case SearchInput onChange call', () => {
    wrapper.find(SearchInput).props().onChange('Test')
    expect(defaultProps.setFilters).nthCalledWith(1, { search: 'Test' })
  })

  describe('mapStateToProps', () => {
    it('should call to filterSelector with state and pass the result as searchFilter prop', () => {
      const { props } = mapStateToProps()
      expect(filterSelector).toHaveBeenCalled()
      expect(props.searchFilter).toEqual(mockFilters[DocumentFilterKeys.SEARCH])
    })
  })

  describe('mapDispatchToProps', () => {
    it('should dispatch setFilters action', () => {
      const { props } = mapDispatchToProps()
      props.setFilters()
      expect(setFilters).toHaveBeenCalled()
    })
  })
})
