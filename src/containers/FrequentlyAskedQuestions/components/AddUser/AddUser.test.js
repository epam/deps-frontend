
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { AddUser } from './AddUser'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: AddUser', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AddUser />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
