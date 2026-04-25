
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SelectOption } from '@/components/Select'
import { FilterOptions } from '../FilterOptions'
import { Search } from './TableSelectFilter.styles'
import { TableSelectFilter } from './'

jest.mock('@/utils/env', () => mockEnv)

const testSource = new SelectOption('test', 'test')
const mockValue = 'mockValue'

describe('Component: TableSelectFilter', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      options: [
        testSource,
      ],
      selectedKeys: ['test'],
      confirm: jest.fn(),
      setSelectedKeys: jest.fn(),
      visible: true,
    }

    wrapper = shallow(<TableSelectFilter {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call setSelectedKeys with correct argument in case of confirmFilter prop call on FilterOptions', () => {
    wrapper.find(FilterOptions).props().confirmFilter(mockValue)

    expect(defaultProps.setSelectedKeys).nthCalledWith(1, mockValue)
  })

  it('should call confirm with correct argument in case of confirmFilter prop call on FilterOptions', () => {
    wrapper.find(FilterOptions).props().confirmFilter()

    expect(defaultProps.confirm).toHaveBeenCalled()
  })

  it('should call pass correct filter value to FilterOptions', () => {
    const mockValue = 'mockValue'
    wrapper.find(Search).props().onChange(mockValue)

    expect(wrapper.find(FilterOptions).props().filter).toEqual(mockValue)
  })
})
