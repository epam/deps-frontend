
import { shallow } from 'enzyme'
import { Dropdown } from '@/components/Dropdown'
import { CustomMenu } from './CustomMenu'
import { StyledMenu } from './CustomMenu.styles'
import { MenuItem, SubMenu } from './CustomMenuItem'

describe('Component: Menu', () => {
  let defaultProps
  let wrapper

  const menuItem = [
    new MenuItem({
      content: () => <div key="option1">Option 1</div>,
      disabled: false,
    }),
    new MenuItem({
      content: () => <div key="option2">Option 2</div>,
      disabled: true,
    })]

  beforeEach(() => {
    defaultProps = {
      disabled: false,
      items: menuItem,
    }

    wrapper = shallow(
      <CustomMenu {...defaultProps}>
        <div />
      </CustomMenu>,
    )
  })

  const getDropdownMenu = () => shallow(<div>{wrapper.find(Dropdown).props().dropdownRender()}</div>)

  it('should render Dropdown and pass correct props', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should render Dropdown menu correctly', () => {
    expect(getDropdownMenu()).toMatchSnapshot()
  })

  it('should render Dropdown menu correctly if item is subContent', () => {
    defaultProps.items = [
      new MenuItem({
        content: () => <div key="option1">Option 1</div>,
        disabled: false,
      }),
      new MenuItem({
        content: () => 'Some string',
        subContent: <div key="optional">SubMenu</div>,
        visible: true,
      }),
    ]

    wrapper.setProps(defaultProps)
    expect(getDropdownMenu()).toMatchSnapshot()
  })

  it('should render Dropdown menu correctly if item is SubMenu', () => {
    defaultProps.items = [
      new SubMenu({
        key: 'subMenuKey',
        title: 'Sub Menu Title',
        children: menuItem,
      }),
    ]

    wrapper.setProps(defaultProps)
    expect(getDropdownMenu()).toMatchSnapshot()
  })

  it('should pass correct callbacks to Dropdown', () => {
    const dropdownComponent = wrapper.find(Dropdown)
    expect(dropdownComponent.props().onOpenChange).toEqual(wrapper.instance().onVisibleChange)
  })

  it('should toggle visibility and pass correct props.open to Dropdown when calling to Dropdown onOpenChange', () => {
    expect(wrapper.find(Dropdown).props().open).toEqual(false)
    wrapper.find(Dropdown).props().onOpenChange(true)
    expect(wrapper.find(Dropdown).props().open).toEqual(true)
  })

  it('should pass correct handler for each Menu Item', () => {
    const menuContent = wrapper.find(Dropdown).props().dropdownRender()
    const menu = shallow(menuContent)
    defaultProps.items.forEach((item, idx) => {
      if (item.onClick) {
        expect(menu.find(StyledMenu.Item).at(idx).props().onClick).toEqual(item.onClick)
      } else {
        expect(menu.find(StyledMenu.Item).at(idx).props().onClick).toEqual(wrapper.instance().handleClick)
      }
    })
  })

  it('should set Key Down handler for Menu Item if onKeyDown prop passed', () => {
    defaultProps.items = [
      new MenuItem({
        content: () => <div key="option1">Option 1</div>,
        onKeyDown: jest.fn(),
      }),
    ]

    wrapper.setProps(defaultProps)
    const menuContent = wrapper.find(Dropdown).props().dropdownRender()
    const menu = shallow(menuContent)

    expect(menu.find(StyledMenu.Item).at(0).props().onKeyDown).toEqual(defaultProps.items[0].onKeyDown)
  })
})
