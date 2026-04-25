
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { toggleAddFieldDrawer } from '@/actions/prototypePage'
import { PrototypeTableFieldDrawer } from '@/containers/PrototypeTableFieldDrawer'
import { FieldType } from '@/enums/FieldType'
import { PrototypeTableField } from '@/models/PrototypeTableField'
import { showTableDrawerSelector } from '@/selectors/prototypePage'

const CreatePrototypeTableField = ({
  addField,
}) => {
  const dispatch = useDispatch()
  const isDrawerVisible = useSelector(showTableDrawerSelector)

  const toggleDrawer = () => {
    dispatch(toggleAddFieldDrawer())
  }

  const createField = async ({ name, ...tabularMapping }) => {
    const field = new PrototypeTableField({
      id: uuidv4(),
      prototypeId: uuidv4(),
      name,
      fieldType: {
        typeCode: FieldType.TABLE,
        description: {},
      },
      tabularMapping,
    })

    addField(field)
    dispatch(toggleAddFieldDrawer())
  }

  return (
    <PrototypeTableFieldDrawer
      closeDrawer={toggleDrawer}
      onSave={createField}
      visible={isDrawerVisible}
    />
  )
}

CreatePrototypeTableField.propTypes = {
  addField: PropTypes.func.isRequired,
}

export {
  CreatePrototypeTableField,
}
