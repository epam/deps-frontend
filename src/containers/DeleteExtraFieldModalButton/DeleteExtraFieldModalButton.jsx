
import PropTypes from 'prop-types'
import { useState } from 'react'
import { deleteExtraFields } from '@/api/enrichmentApi'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeExtraFieldShape } from '@/models/DocumentTypeExtraField'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteExtraFieldModalButton = ({
  documentTypeCode,
  field,
  onAfterDelete,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleRemove = async () => {
    try {
      setIsLoading(true)
      await deleteExtraFields(documentTypeCode, [field.code])
      notifySuccess(localize(Localization.DELETE_SUCCESS, { name: field.name }))
      await onAfterDelete()
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_EXTRA_FIELD_CONFIRM_MESSAGE),
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

DeleteExtraFieldModalButton.propTypes = {
  documentTypeCode: PropTypes.string.isRequired,
  field: documentTypeExtraFieldShape.isRequired,
  onAfterDelete: PropTypes.func.isRequired,
}

export {
  DeleteExtraFieldModalButton,
}
