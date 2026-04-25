
import PropTypes from 'prop-types'
import { MenuItemButton } from './MenuItemTrigger.styles'

const MenuItemTrigger = ({
  onClick,
  disabled,
  label,
}) => (
  <MenuItemButton
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </MenuItemButton>
)

MenuItemTrigger.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

export {
  MenuItemTrigger,
}
