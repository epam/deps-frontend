
import { shallow } from 'enzyme'
import { ErrorBoundRoute } from '.'

describe('Component: ErrorBoundRoute', () => {
  let defaultProps, wrapper

  const Test = () => <div>Test</div>

  beforeEach(() => {
    defaultProps = {
      path: '/test',
      exact: true,
    }
  })

  it('should render correct layout based on the render props', () => {
    wrapper = shallow(
      <ErrorBoundRoute
        {...defaultProps}
        render={Test}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct layout based on the children props', () => {
    wrapper = shallow(
      <ErrorBoundRoute {...defaultProps}>
        <Test />
      </ErrorBoundRoute>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
