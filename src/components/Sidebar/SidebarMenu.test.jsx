
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { SidebarMenu } from './SidebarMenu'

jest.mock('@/utils/env', () => mockEnv)

window.open = jest.fn()

const mockPath = '/mock/path-1'

describe('Component: Sidebar', () => {
  let defaultProps
  let wrapper
  let mockEvent

  beforeEach(() => {
    defaultProps = {
      config: [
        [
          {
            path: mockPath,
            title: 'mock Title 1',
            icon: <div />,
          },
          {
            path: '/mock/path-2',
            title: 'mock Title 2',
            icon: <div />,
          },
        ],
      ],
      onClick: jest.fn(),
      selectedKeys: [],
    }

    mockEvent = {
      ctrlKey: false,
      shiftKey: false,
      target: {
        value: 'mockValue',
      },
    }

    wrapper = shallow(<SidebarMenu {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props.onClick with correct argument when calling to menu onClick', () => {
    wrapper.props().onClick({
      domEvent: mockEvent,
      key: mockPath,
    })

    expect(defaultProps.onClick).nthCalledWith(1, mockPath)
  })
})
