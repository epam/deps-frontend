
import { shallow } from 'enzyme'
import { ErrorBoundary } from './'

describe('Component: ErrorBoundary', () => {
  const InnerComponent = () => <div>Content</div>
  let error, wrapper
  beforeEach(() => {
    error = new Error('Simulated error in ErrorBoundary component test')
    wrapper = shallow(
      <ErrorBoundary>
        <InnerComponent />
      </ErrorBoundary>,
    )
  })

  it('should render default Something went wrong', () => {
    wrapper.find(InnerComponent).simulateError(error)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render default local boundary from props', () => {
    const localBoundary = () => (<div>Local boundary</div>)
    wrapper.setProps({ localBoundary })
    wrapper.find(InnerComponent).simulateError(error)
    expect(wrapper).toMatchSnapshot()
  })
})
