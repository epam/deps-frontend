
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Search } from './Search'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: Search', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Search />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
