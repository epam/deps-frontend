
import { shallow } from 'enzyme'
import { Card } from '.'

describe('Component: Card', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      count: 1,
      title: 'mockTitle',
      icon: <div />,
      onClick: jest.fn(),
    }

    wrapper = shallow(<Card {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
