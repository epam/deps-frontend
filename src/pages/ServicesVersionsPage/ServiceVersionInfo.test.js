
import { shallow } from 'enzyme'
import { ServiceVersionInfo } from './ServiceVersionInfo'

describe('Component: ServiceVersionInfo', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      serviceName: 'MockService',
      serviceInfo: {
        buildTag: 'latest',
        buildDate: 'now',
      },
    }

    wrapper = shallow(<ServiceVersionInfo {...defaultProps} />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
