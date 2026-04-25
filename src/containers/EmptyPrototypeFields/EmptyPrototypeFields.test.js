
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { EmptyPrototypeFields } from './index'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: EmptyPrototypeFields', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      renderExtra: jest.fn(),
    }

    wrapper = shallow(<EmptyPrototypeFields {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
