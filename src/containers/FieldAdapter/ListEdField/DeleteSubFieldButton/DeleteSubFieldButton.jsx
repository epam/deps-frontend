
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { saveExtractedDataField } from '@/actions/documentReviewPage'
import { Tooltip } from '@/components/Tooltip'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { useFieldProps } from '@/containers/FieldAdapter/useFieldProps'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { extractedDataFieldShape } from '@/models/ExtractedData'

const DeleteSubFieldButton = ({
  edField,
  dtField,
  fieldToDeleteIndex,
  documentId,
}) => {
  const { setField } = useFieldProps(dtField, edField)
  const dispatch = useDispatch()

  const isLastListItem = edField.data.length === 1

  const getAliases = () => {
    const aliases = { ...edField.aliases }
    const subFieldData = edField.data.find((data) => data.index === fieldToDeleteIndex)
    delete aliases[subFieldData.id]
    return aliases
  }

  const deleteField = async () => {
    const updatedEdField = {
      ...edField,
      aliases: getAliases(),
      data: edField.data.filter((data) => data.index !== fieldToDeleteIndex),
    }

    setField(updatedEdField)

    try {
      await dispatch(saveExtractedDataField({
        aliases: updatedEdField.aliases,
        data: updatedEdField.data,
        fieldPk: updatedEdField.fieldPk,
        documentPk: documentId,
      }))
    } catch {
      setField(edField)
    }
  }

  return (
    <Tooltip
      title={isLastListItem && localize(Localization.REMOVE_LAST_LIST_ITEM_TEXT)}
    >
      <ActionsMenu.ItemButton
        disabled={isLastListItem}
        onClick={deleteField}

      >
        {localize(Localization.DELETE_FIELD)}
      </ActionsMenu.ItemButton>
    </Tooltip>
  )
}

DeleteSubFieldButton.propTypes = {
  edField: extractedDataFieldShape.isRequired,
  dtField: documentTypeFieldShape.isRequired,
  fieldToDeleteIndex: PropTypes.number.isRequired,
  documentId: PropTypes.string.isRequired,
}

export {
  DeleteSubFieldButton,
}
