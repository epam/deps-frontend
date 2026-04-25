
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { PageNavigationHeader } from './PageNavigationHeader'

jest.mock('@/utils/env', () => mockEnv)

const mockExtra = () => <div>extra</div>

describe('Container: PageNavigationHeader', () => {
  let wrapper
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      parentPath: 'mockPath',
      title: 'mockTitle',
      renderExtra: mockExtra,
    }

    wrapper = shallow(<PageNavigationHeader {...defaultProps} />)
  })

  it('should render the correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
