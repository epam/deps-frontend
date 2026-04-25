
import PropTypes from 'prop-types'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import {
  ButtonSeparator,
  ButtonWrapper,
  PlusIcon,
} from './AddNewNodeButton.styles'

const AddNewNodeButton = ({ onClick }) => (
  <ButtonWrapper
    data-testid={TEST_ID.ADD_NEW_NODE_BUTTON}
    onClick={onClick}
  >
    <ButtonSeparator />
    <PlusIcon />
    <ButtonSeparator />
  </ButtonWrapper>
)

AddNewNodeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export {
  AddNewNodeButton,
}
