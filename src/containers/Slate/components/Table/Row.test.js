
import { shallow } from 'enzyme'
import { Row } from './Row'

describe('Component: Row', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    const children = <div />
    defaultProps = {
      children,
    }

    wrapper = shallow(<Row {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
