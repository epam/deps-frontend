
import PropTypes from 'prop-types'
import {
  ButtonSeparator,
  ButtonWrapper,
  PlusIcon,
} from './AddNewNodeButton.styles'

export const AddNewNodeButton = ({ onClick }) => (
  <ButtonWrapper onClick={onClick}>
    <ButtonSeparator />
    <PlusIcon />
    <ButtonSeparator />
  </ButtonWrapper>
)

AddNewNodeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}
