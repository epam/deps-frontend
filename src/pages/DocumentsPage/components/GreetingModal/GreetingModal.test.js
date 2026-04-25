
import { mockReact } from '@/mocks/mockReact'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { userSelector } from '@/selectors/authorization'
import { GreetingModal } from './GreetingModal'
import { Text } from './GreetingModal.styles'

jest.mock('react', () => mockReact())
jest.mock('@/selectors/authorization')
jest.mock('@/utils/env', () => mockEnv)

describe('Component: GreetingModal', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      user: userSelector.getSelectorMockValue(),
    }

    wrapper = shallow(<GreetingModal {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should return correct text message if no user.firstName and user.lastName', () => {
    defaultProps.user = {
      ...defaultProps.user,
      firstName: null,
      lastName: null,
    }

    wrapper.setProps(defaultProps)

    const Message = shallow(<div>{wrapper.find(Text).props().children}</div>)

    expect(Message).toMatchSnapshot()
  })

  it('should render correctly with only user.lastName', () => {
    defaultProps.user = {
      ...defaultProps.user,
      firstName: null,
    }

    wrapper.setProps(defaultProps)

    const Message = shallow(<div>{wrapper.find(Text).props().children}</div>)

    expect(Message).toMatchSnapshot()
  })
})
