
import ArrowDownWide from '@/assets/icons/arrow-down-wide.svg'
import { IconsShape } from './Icons'
import { Icon } from './Icons.styles'

const ArrowDownWideIcon = ({ className, ...rest }) => (
  <Icon
    {...rest}
  >
    <ArrowDownWide className={className} />
  </Icon>
)

ArrowDownWideIcon.propTypes = IconsShape

export {
  ArrowDownWideIcon,
}
