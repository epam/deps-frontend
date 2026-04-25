
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { OutputState } from '@/enums/OutputState'
import { ProfileStatus } from '../enums/ProfileStatus'
import { OutputNotification } from './OutputNotification'
import { InfoMessage } from './OutputNotification.styles'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: OutputNotification', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      onClick: jest.fn(),
      profileStatus: ProfileStatus.DELETED,
      state: OutputState.READY,
    }

    wrapper = shallow(<OutputNotification {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render InfoMessage if output state is pending', () => {
    defaultProps.state = OutputState.PENDING

    wrapper.setProps(defaultProps)

    expect(wrapper.find(InfoMessage).exists()).toBe(true)
  })
})
