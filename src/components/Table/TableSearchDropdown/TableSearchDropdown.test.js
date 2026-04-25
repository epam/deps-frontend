
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SearchInput } from '@/containers/SearchInput'
import { TableSearchDropdown } from './TableSearchDropdown'

jest.mock('@/utils/env', () => mockEnv)

const mockSearchValue = 'mockValue'

describe('Component: TableSearchDropdown', () => {
  let wrapper, defaultProps, Input

  beforeEach(() => {
    defaultProps = {
      searchValue: '',
      onChange: jest.fn(),
      confirm: jest.fn(),
      visible: true,
    }

    wrapper = shallow(<TableSearchDropdown {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call onChange and confirm with correct on input change', () => {
    Input = wrapper.find(SearchInput)
    Input.props().onChange(mockSearchValue)

    expect(defaultProps.onChange).nthCalledWith(1, mockSearchValue)
    expect(defaultProps.confirm).toHaveBeenCalled()
  })
})
