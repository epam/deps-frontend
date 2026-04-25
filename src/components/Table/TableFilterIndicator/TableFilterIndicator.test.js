
import { shallow } from 'enzyme'
import { TableFilterIndicator } from './TableFilterIndicator'

describe('Component: TableFilterIndicator', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      active: false,
    }

    wrapper = shallow(<TableFilterIndicator {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render passed icon node in case icon prop was passed', () => {
    wrapper.setProps({
      ...defaultProps,
      icon: <span>Mock Icon</span>,
    })

    expect(wrapper).toMatchSnapshot()
  })
})
