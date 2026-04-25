
import { shallow } from 'enzyme'
import { Pagination } from './Pagination'

describe('Component: Pagination', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onChange: jest.fn(),
      showSizeChanger: true,
      pageSize: 10,
      pageSizeOptions: [5, 10, 15, 20],
      total: 10,
      current: 1,
    }

    wrapper = shallow(<Pagination {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
