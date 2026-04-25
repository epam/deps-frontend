
import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/Button'
import { PlusFilledIcon } from '@/components/Icons/PlusFilledIcon'
import { Tooltip } from '@/components/Tooltip'
import { AddDocumentSupplementDrawer } from '@/containers/AddDocumentSupplementDrawer'
import { FieldType } from '@/enums/FieldType'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { DocumentSupplement, documentSupplementShape } from '@/models/DocumentSupplement'

const initialField = new DocumentSupplement({
  code: uuidv4(),
  name: '',
  type: FieldType.STRING,
  value: '',
})

const AddFieldButton = ({
  disabled,
  documentSupplements,
  documentTypeCode,
  documentId,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [field, setField] = useState(initialField)

  const toggleDrawer = () => {
    setField(initialField)
    setIsDrawerVisible((prev) => !prev)
  }

  return (
    <>
      <Tooltip
        placement={Placement.BOTTOM}
        title={localize(Localization.ADD_NEW_EXTRA_FIELD_TOOLTIP)}
      >
        <Button.Secondary
          disabled={disabled}
          onClick={toggleDrawer}
        >
          <PlusFilledIcon
            $disabled={disabled}
          />
          {localize(Localization.ADD_NEW_FIELD)}
        </Button.Secondary>
      </Tooltip>
      <AddDocumentSupplementDrawer
        documentId={documentId}
        documentSupplements={documentSupplements}
        documentTypeCode={documentTypeCode}
        field={field}
        isDrawerVisible={isDrawerVisible}
        toggleDrawer={toggleDrawer}
      />
    </>
  )
}

AddFieldButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  documentSupplements: PropTypes.arrayOf(
    documentSupplementShape,
  ).isRequired,
  documentTypeCode: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
}

export {
  AddFieldButton,
}
