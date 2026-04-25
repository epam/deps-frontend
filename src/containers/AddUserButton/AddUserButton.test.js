
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { shallow } from 'enzyme'
import { AddUserButton } from './AddUserButton'

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation')
jest.mock('@/selectors/authorization')
jest.mock('@/apiRTK/iamApi', () => ({
  useGetOrganisationUsersQuery: jest.fn(() => ({
    refetch: jest.fn(),
  })),
}))

describe('Container: AddUserButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddUserButton />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
