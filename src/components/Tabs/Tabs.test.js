
import { shallow } from 'enzyme'
import { Tabs as AntdTabs } from './Tabs.styles'
import { Tabs, Tab } from '.'

describe('Component: Tabs', () => {
  let defaultProps
  let wrapper
  const MockExtra = () => <div>mock extra</div>
  const MockTab1Content = () => <div>Mock Tab 1 Content</div>

  const mockTab1 = new Tab('mockKey1', 'mock Title 1', <MockTab1Content />)
  const mockTab2 = new Tab('mockKey2', 'mock Title 2', null, true)

  const mockTabs = [mockTab1, mockTab2]
  beforeEach(() => {
    defaultProps = {
      activeKey: mockTab1.key,
      animated: false,
      onChange: jest.fn(),
      tabs: mockTabs,
      extra: <MockExtra />,
    }

    wrapper = shallow(<Tabs {...defaultProps} />)
  })

  it('should render correct layout according to props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should call props.onChange in case calling to AntdTabs.props.onChange', () => {
    const AntdTabsProps = wrapper.find(AntdTabs).props()
    AntdTabsProps.onChange()
    expect(defaultProps.onChange).toHaveBeenCalled()
  })
})
