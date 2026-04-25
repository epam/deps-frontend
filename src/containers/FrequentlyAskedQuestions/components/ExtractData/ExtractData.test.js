
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ExtractData } from './ExtractData'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ExtractData', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ExtractData />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
