
import PropTypes from 'prop-types'
import More from '@/assets/icons/ic-32-more.svg'
import { Icon } from './Icons.styles'

const MoreIcon = (props) => (
  <Icon>
    <More className={props.className} />
  </Icon>
)

MoreIcon.propTypes = {
  className: PropTypes.string,
}

export {
  MoreIcon,
}
