
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Authorization } from './Authorization'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/application/Root', () => mockComponent('Root'))

describe('Component: Authorization', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Authorization />)
  })

  it('should render component correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
