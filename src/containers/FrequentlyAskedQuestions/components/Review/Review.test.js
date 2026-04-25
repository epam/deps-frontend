
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Review } from './Review'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: Review', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Review />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
