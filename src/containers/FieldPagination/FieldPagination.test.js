
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { FieldPagination } from './FieldPagination'
import { Text } from './FieldPagination.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: FieldPagination', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onChange: jest.fn(),
      showSizeChanger: true,
      pageSize: 10,
      total: 10,
      goToPage: jest.fn(),
      current: 1,
    }

    wrapper = shallow(<FieldPagination {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Total correctly', () => {
    const expected = 'Showing 1 to 10 of 10 results'

    const text = wrapper.find(Text).text()
    expect(text).toEqual(expected)
  })
})
