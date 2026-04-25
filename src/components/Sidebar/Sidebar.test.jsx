
import { mockEnv } from '@/mocks/mockEnv'
import { shallowWithTheme } from '@/utils/shallowWithTheme'
import { Sidebar } from '.'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/features', () => ({
  isFeatureEnabled: jest.fn(() => true),
}))

describe('Component: Sidebar', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      config: [
        [
          {
            path: '/mock/path',
            title: 'mock Title',
            icon: <div />,
          },
        ],
      ],
      selectedKeys: ['/mock/path'],
      onClick: jest.fn(),
      collapsed: true,
    }

    wrapper = shallowWithTheme(<Sidebar {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })
})
