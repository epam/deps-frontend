
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Unauthorized } from './Unauthorized'

jest.mock('@/utils/env', () => mockEnv)

describe('Page: Unauthorized', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Unauthorized />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
