
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  CellWrapper,
  DeleteIcon,
  AddIcon,
} from './TableCell.styles'

const TableCell = ({
  text,
  showActionButton,
  onRemoveClick,
  onAddClick,
  isMappedToField,
}) => {
  const getButton = () => {
    if (isMappedToField) {
      return (
        <ButtonIcon
          icon={<DeleteIcon />}
          onClick={onRemoveClick}
        />
      )
    }

    return (
      <ButtonIcon
        icon={<AddIcon />}
        onClick={onAddClick}
      />
    )
  }

  return (
    <CellWrapper>
      <span>{text}</span>
      {showActionButton && getButton()}
    </CellWrapper>
  )
}

TableCell.propTypes = {
  text: PropTypes.string,
  showActionButton: PropTypes.bool.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  isMappedToField: PropTypes.bool.isRequired,
}
export {
  TableCell,
}
