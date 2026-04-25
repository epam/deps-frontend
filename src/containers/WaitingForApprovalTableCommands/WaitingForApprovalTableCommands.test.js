
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { WaitingForApprovalUser } from '@/models/WaitingForApprovalUser'
import { WaitingForApprovalTableCommands } from './WaitingForApprovalTableCommands'

jest.mock('@/utils/env', () => mockEnv)

const waitingUser = new WaitingForApprovalUser({
  creationDate: 'date',
  email: 'email',
  firstName: 'name',
  lastName: '',
  organisation: 'org',
  pk: 'pk',
  username: '',
})

describe('Component: WaitingForApprovalTableCommands', () => {
  let wrapper, defaultProps

  beforeEach(() => {
    defaultProps = {
      user: waitingUser,
    }

    wrapper = shallow(<WaitingForApprovalTableCommands {...defaultProps} />)
  })

  it('should render the correct layout if user prop is passed', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render the correct layout if user prop is not passed', () => {
    wrapper.setProps({
      ...defaultProps,
      user: undefined,
    })
    expect(wrapper).toMatchSnapshot()
  })
})
