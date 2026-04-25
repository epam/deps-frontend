
import PropTypes from 'prop-types'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { ButtonIcon } from './FieldControls.styles'

const FieldControls = ({ disabled, onDelete }) => (
  <ButtonIcon
    disabled={disabled}
    icon={<XMarkIcon />}
    onClick={onDelete}
  />
)

FieldControls.propTypes = {
  disabled: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
}

export {
  FieldControls,
}
