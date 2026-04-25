
import { mockReact } from '@/mocks/mockReact'
import { shallow } from 'enzyme'
import { authenticationProvider } from '@/authentication'
import { SilentRenew } from './SilentRenew'

jest.mock('react', () => mockReact())

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    signInSilentCallback: jest.fn(),
  },
}))

describe('Page: SilentRenew', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SilentRenew />)
  })

  it('should not render any layout', async () => {
    expect(wrapper.isEmptyRender()).toBe(true)
  })

  it('should call to signInSilentCallback after rendering', () => {
    expect(authenticationProvider.signInSilentCallback).toHaveBeenCalled()
  })
})
