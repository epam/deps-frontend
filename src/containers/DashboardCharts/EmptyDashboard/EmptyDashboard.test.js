
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EmptyDashboard } from '.'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: EmptyDashboard', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<EmptyDashboard />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
