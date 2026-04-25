
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { saveExtractedDataField } from '@/actions/documentReviewPage'
import { useFieldProps } from '@/containers/FieldAdapter/useFieldProps'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import {
  DictFieldData,
  extractedDataFieldShape,
  FieldData,
} from '@/models/ExtractedData'
import { PlusIcon, Button } from './AddSubFieldButton.styles'

const FIELD_TYPE_TO_FIELD_DATA = {
  [FieldType.CHECKMARK]: new FieldData(null),
  [FieldType.STRING]: new FieldData(),
  [FieldType.DICTIONARY]: new DictFieldData(),
  [FieldType.ENUM]: new FieldData(),
  [FieldType.DATE]: new FieldData(),
}

const AddSubFieldButton = ({
  dtField,
  edField,
  documentId,
  disabled,
}) => {
  const { setField } = useFieldProps(dtField, edField)
  const dispatch = useDispatch()

  const addField = async () => {
    const newEdField = {
      ...edField,
      data: [
        ...edField.data,
        {
          ...FIELD_TYPE_TO_FIELD_DATA[dtField.fieldMeta.baseType],
          index: edField.data.length,
        },
      ],
    }

    try {
      setField(newEdField)

      await dispatch(saveExtractedDataField({
        aliases: newEdField.aliases,
        data: newEdField.data,
        fieldPk: newEdField.fieldPk,
        documentPk: documentId,
      }))
    } catch {
      setField(edField)
    }
  }

  return (
    <Button
      disabled={disabled}
      onClick={addField}
    >
      <PlusIcon disabled={disabled} />
      {localize(Localization.ADD_FIELD)}
    </Button>
  )
}

AddSubFieldButton.propTypes = {
  edField: extractedDataFieldShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  documentId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
}
export {
  AddSubFieldButton,
}
