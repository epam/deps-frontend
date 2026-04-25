
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { OrganisationUsersTableCommands } from './OrganisationUsersTableCommands'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: OrganisationUsersTableCommands', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<OrganisationUsersTableCommands />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
