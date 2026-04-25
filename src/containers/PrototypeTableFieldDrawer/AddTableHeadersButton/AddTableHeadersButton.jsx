
import PropTypes from 'prop-types'
import {
  Button,
  PlusIcon,
} from './AddTableHeadersButton.styles'

const AddTableHeadersButton = ({
  disabled,
  onClick,
  title,
}) => (
  <Button
    disabled={disabled}
    onClick={onClick}
  >
    <PlusIcon disabled={disabled} />
    {title}
  </Button>
)

AddTableHeadersButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
export {
  AddTableHeadersButton,
}
