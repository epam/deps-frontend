
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Validation } from './Validation'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: Validation', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Validation />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
