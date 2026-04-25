
import Delete from '@/assets/icons/ic-24-delete-filled.svg'
import { IconsShape } from './Icons'
import { Icon } from './Icons.styles'

const DeleteIconFilled = ({ className, ...rest }) => (
  <Icon
    {...rest}
  >
    <Delete className={className} />
  </Icon>
)

DeleteIconFilled.propTypes = IconsShape

export {
  DeleteIconFilled,
}
