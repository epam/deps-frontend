
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { ReadOnlyMappingKey } from './ReadOnlyMappingKey'

jest.mock('@/utils/env', () => mockEnv)

describe('Component: ReadOnlyMappingKey', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    jest.clearAllMocks()

    defaultProps = {
      mappingKey: 'key',
    }

    wrapper = shallow(<ReadOnlyMappingKey {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
