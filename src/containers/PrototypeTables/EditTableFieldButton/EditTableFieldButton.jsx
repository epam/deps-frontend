
import PropTypes from 'prop-types'
import { useState } from 'react'
import { PenIcon } from '@/components/Icons/PenIcon'
import { PrototypeTableFieldDrawer } from '@/containers/PrototypeTableFieldDrawer'
import { TableFieldColumn, TableFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { prototypeTableFieldShape } from '@/models/PrototypeTableField'
import { ButtonIcon } from './EditTableFieldButton.styles'

const EditTableFieldButton = ({
  field,
  updateField,
  isEditMode,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerVisible((prev) => !prev)
  }

  const onSave = async ({ name, ...tabularMapping }) => {
    updateField({
      ...field,
      fieldType: {
        ...field.fieldType,
        description: new TableFieldMeta(
          tabularMapping.headers.map((h) => (
            new TableFieldColumn(h.name)
          )),
        ),
      },
      name,
      tabularMapping,
    })

    toggleDrawer()
  }

  return (
    <>
      {
        isEditMode && (
          <ButtonIcon
            icon={<PenIcon />}
            onClick={toggleDrawer}
          />
        )
      }
      <PrototypeTableFieldDrawer
        closeDrawer={toggleDrawer}
        field={field}
        onSave={onSave}
        visible={isDrawerVisible}
      />
    </>
  )
}

EditTableFieldButton.propTypes = {
  field: prototypeTableFieldShape.isRequired,
  updateField: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
}

export {
  EditTableFieldButton,
}
