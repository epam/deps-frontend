
import { shallow } from 'enzyme'
import { DownOutlined } from '@/components/Icons/DownOutlined'
import { TogglerButton } from './TogglerButton'

describe('Component: TogglerButton', () => {
  let defaultProps
  let wrapper

  beforeEach(() => {
    defaultProps = {
      collapsed: false,
      title: 'TestTitle',
    }

    wrapper = shallow(<TogglerButton {...defaultProps} />)
  })

  it('should render a correct layout', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render DownOutlined icon with rotation in case props.collapsed: false', () => {
    const iconProps = wrapper.find(DownOutlined).props()
    expect(iconProps.rotate).toEqual(180)
  })

  it('should render DownOutlined icon without rotation in case props.collapsed: true', () => {
    defaultProps.collapsed = true
    wrapper = shallow(<TogglerButton {...defaultProps} />)
    const icon = wrapper.find(DownOutlined)
    expect(icon.exists(icon.props)).toBe(false)
  })
})
