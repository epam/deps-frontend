
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveTable, toggleAddFieldDrawer } from '@/actions/prototypePage'
import { ButtonType } from '@/components/Button'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'
import { CreatePrototypeTableField } from '@/containers/CreatePrototypeTableField'
import { localize, Localization } from '@/localization/i18n'
import { activeTableSelector } from '@/selectors/prototypePage'
import { Button } from './AddFieldButton.styles'

const AddFieldButton = ({
  addField,
  toggleEditMode,
  isEditMode,
}) => {
  const dispatch = useDispatch()
  const activeTable = useSelector(activeTableSelector)

  const showAddFieldDrawer = () => {
    !isEditMode && toggleEditMode?.()
    activeTable && dispatch(setActiveTable(null))
    dispatch(toggleAddFieldDrawer())
  }

  return (
    <>
      <Button
        onClick={showAddFieldDrawer}
        type={ButtonType.PRIMARY}
      >
        <NewPlusIcon />
        {localize(Localization.ADD_NEW)}
      </Button>
      <CreatePrototypeTableField
        addField={addField}
      />
    </>
  )
}

AddFieldButton.propTypes = {
  addField: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  toggleEditMode: PropTypes.func,
}

export {
  AddFieldButton,
}
