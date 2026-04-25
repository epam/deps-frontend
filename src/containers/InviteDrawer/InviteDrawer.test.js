
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { InviteDrawer } from './InviteDrawer'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: InviteDrawer', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      visible: true,
      onClose: jest.fn(),
      refetchUsers: jest.fn(),
    }
    jest.clearAllMocks()
    wrapper = shallow(<InviteDrawer {...defaultProps} />)
  })

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
