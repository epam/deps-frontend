
import { shallow } from 'enzyme'
import { StatusCode } from '@/enums/StatusCode'
import { ErrorLayout } from './ErrorLayout'

describe('Component: ErrorLayout', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      statusCode: StatusCode.NOT_FOUND,
      heading: 'Heading',
      info: 'infoText',
    }

    wrapper = shallow(<ErrorLayout {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
