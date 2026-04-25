
import { mockEnv } from '@/mocks/mockEnv'
import { shallow } from 'enzyme'
import { Tab } from '@/components/Tabs'
import { shallowWithTheme } from '@/utils/shallowWithTheme'
import { DataTabsSwitcher } from './DataTabsSwitcher.jsx'

jest.mock('@/utils/env', () => mockEnv)

describe('Container: DataTabsSwitcher', () => {
  let defaultProps, wrapper
  const MockTab1Content = () => <div>Mock Tab 1 Content</div>
  const mockTab1 = new Tab('mockKey1', 'mock Title 1', <MockTab1Content />)

  beforeEach(() => {
    defaultProps = {
      tabs: [mockTab1],
      changeActiveTab: jest.fn(),
    }

    wrapper = shallowWithTheme(<DataTabsSwitcher {...defaultProps} />)
  })

  it('should render correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correct items', () => {
    const menuItemsProp = wrapper.props().items
    menuItemsProp.forEach((item) => {
      expect(shallow(<div>{item.content()}</div>)).toMatchSnapshot()
    })
  })
})
