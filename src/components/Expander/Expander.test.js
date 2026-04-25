
import { shallow } from 'enzyme'
import { Expander } from './Expander'

const MockFunction = (a, b) => (
  <div
    a={a}
    b={b}
  >
    Function
  </div>
)
const MockComponent = (
  <div
    a={'a'}
    b={'b'}
  >
    Component
  </div>
)

describe('Component: Expander', () => {
  let defaultProps
  let component

  beforeEach(() => {
    defaultProps = {
      children: MockFunction,
    }

    component = shallow(<Expander {...defaultProps} />)
  })

  it('should correct layout', () => {
    expect(component).toMatchSnapshot()
  })

  it('should correct layout if children is component', () => {
    defaultProps.children = MockComponent
    expect(component).toMatchSnapshot()
  })
})
