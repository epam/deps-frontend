
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { authenticationProvider } from '@/authentication'
import { AuthenticationGuard } from './AuthenticationGuard'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/authentication', () => ({
  authenticationProvider: {
    isAuthenticated: jest.fn(() => true),
  },
}))

describe('Component: AuthenticationGuard', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      children: <div />,
    }

    wrapper = shallow(<AuthenticationGuard {...defaultProps} />)
  })

  it('should render children prop if user is authenticated', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Redirect to sign in page in case user is not authenticated', () => {
    authenticationProvider.isAuthenticated.mockImplementationOnce(() => false)
    wrapper = shallow(<AuthenticationGuard {...defaultProps} />)

    expect(wrapper).toMatchSnapshot()
  })
})
