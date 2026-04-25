
import PropTypes from 'prop-types'
import { ActionIcon } from './MessageActionButton.styles'

const MessageActionButton = ({
  icon,
  ...restProps
}) => (
  <ActionIcon
    icon={icon}
    {...restProps}
  />
)

MessageActionButton.propTypes = {
  icon: PropTypes.element.isRequired,
}

export {
  MessageActionButton,
}
