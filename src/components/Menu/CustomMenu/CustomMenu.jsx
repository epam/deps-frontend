
import PropTypes from 'prop-types'
import { PureComponent, Fragment } from 'react'
import { Dropdown } from '@/components/Dropdown'
import { CUSTOM_MENU, CUSTOM_MENU_ITEM } from '@/constants/automation'
import { Placement } from '@/enums/Placement'
import { MenuTrigger } from '../Menu'
import { StyledMenu } from './CustomMenu.styles'
import { menuItemShape, subMenuShape } from './CustomMenuItem'

class CustomMenu extends PureComponent {
  static propTypes = {
    placement: PropTypes.oneOf(Object.values(Placement)),
    arrow: PropTypes.bool,
    className: PropTypes.string,
    getPopupContainer: PropTypes.func,
    disabled: PropTypes.bool,
    trigger: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([
        menuItemShape,
        subMenuShape,
      ]),
    ).isRequired,
    children: PropTypes.element.isRequired,
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    onVisibleChange: PropTypes.func,
  }

  state = {
    visible: false,
  }

  handleClick = () => {
    this.setState({
      visible: false,
    })
  }

  onVisibleChange = (visible) => {
    this.props.onVisibleChange?.(visible)
    this.setState({
      visible,
    })
  }

  renderItem = (item, key, parentKey) => {
    const itemKey = parentKey ? `${parentKey}-${key}` : key

    if (item.subContent) {
      return (
        <Fragment key={itemKey}>
          {item.subContent}
        </Fragment>
      )
    }

    return (
      <StyledMenu.Item
        key={itemKey}
        data-automation={CUSTOM_MENU_ITEM}
        disabled={item.disabled}
        onClick={item.onClick ?? this.handleClick}
        onKeyDown={item.onKeyDown}
        style={item.style}
      >
        {item.content()}
      </StyledMenu.Item>
    )
  }

  renderItems = (items, parentKey) => items.map(
    (item, index) => {
      if (item.children) {
        const { key, title, children } = item

        return (
          <StyledMenu.SubMenu
            key={key}
            title={title}
          >
            {this.renderItems(children, key)}
          </StyledMenu.SubMenu>
        )
      }

      return this.renderItem(item, index, parentKey)
    })

  renderMenu = () => (
    <StyledMenu
      className={this.props.className}
      data-automation={CUSTOM_MENU}
      defaultSelectedKeys={this.props.defaultSelectedKeys}
      getPopupContainer={this.props.getPopupContainer || this.getPopupContainer}
    >
      {this.renderItems(this.props.items)}
    </StyledMenu>
  )

  getPopupContainer = (trigger) => trigger

  render = () => (
    <Dropdown
      arrow={this.props.arrow}
      disabled={this.props.disabled}
      dropdownRender={this.renderMenu}
      getPopupContainer={this.props.getPopupContainer || this.getPopupContainer}
      onOpenChange={this.onVisibleChange}
      open={this.state.visible}
      placement={this.props.placement}
      trigger={
        [
          this.props.trigger || MenuTrigger.CLICK,
        ]
      }
    >
      {this.props.children}
    </Dropdown>
  )
}

export {
  CustomMenu,
}
