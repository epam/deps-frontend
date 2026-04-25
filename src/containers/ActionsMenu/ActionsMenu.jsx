
import PropTypes from 'prop-types'
import { DotsVerticalIcon } from '@/components/Icons/DotsVerticalIcon'
import { MenuTrigger } from '@/components/Menu'
import { menuItemShape, subMenuShape } from '@/components/Menu/CustomMenu'
import { Button, Menu } from './ActionsMenu.styles'

const ActionsMenu = ({
  disabled,
  items,
}) => (
  <Menu
    disabled={disabled}
    items={items}
    trigger={MenuTrigger.CLICK}
  >
    <Button
      disabled={disabled}
      icon={<DotsVerticalIcon />}
    />
  </Menu>
)

ActionsMenu.propTypes = {
  disabled: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      menuItemShape,
      subMenuShape,
    ]),
  ).isRequired,
}

export {
  ActionsMenu,
}
