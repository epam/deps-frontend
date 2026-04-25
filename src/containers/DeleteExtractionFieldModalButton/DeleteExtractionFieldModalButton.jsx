
import PropTypes from 'prop-types'
import { useDeleteExtractionFieldMutation } from '@/apiRTK/extractionFieldsApi'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteExtractionFieldModalButton = ({
  documentTypeCode,
  field,
  onAfterDelete,
}) => {
  const [
    deleteExtractionField,
    { isLoading },
  ] = useDeleteExtractionFieldMutation()

  const handleRemove = async () => {
    try {
      await deleteExtractionField({
        documentTypeCode,
        fieldCodes: [field.code],
      }).unwrap()
      notifySuccess(localize(Localization.DELETE_SUCCESS, { name: field.name }))
      await onAfterDelete()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_FIELD_CONFIRM_MESSAGE),
      onOk: handleRemove,
    })
  }

  return (
    <TableActionIcon
      disabled={isLoading}
      icon={<TrashIcon />}
      onClick={confirmRemoval}
    />
  )
}

DeleteExtractionFieldModalButton.propTypes = {
  documentTypeCode: PropTypes.string.isRequired,
  field: documentTypeFieldShape.isRequired,
  onAfterDelete: PropTypes.func.isRequired,
}

export {
  DeleteExtractionFieldModalButton,
}
