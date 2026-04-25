
import PropTypes from 'prop-types'
import stylePropType from 'react-style-proptype'

class MenuItem {
  constructor ({
    content,
    disabled,
    onClick,
    onKeyDown,
    style,
    subContent,
  }) {
    this.content = content
    this.disabled = disabled
    this.onClick = onClick
    this.onKeyDown = onKeyDown
    this.style = style
    this.subContent = subContent
  }
}

const menuItemShape = PropTypes.shape({
  content: PropTypes.func,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  style: stylePropType,
  disabled: PropTypes.bool,
  subContent: PropTypes.element,
})

class SubMenu {
  constructor ({
    key,
    title,
    children,
  }) {
    this.key = key
    this.title = title
    this.children = children
  }
}

const subMenuShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.arrayOf(menuItemShape).isRequired,
})

export {
  MenuItem,
  menuItemShape,
  SubMenu,
  subMenuShape,
}
