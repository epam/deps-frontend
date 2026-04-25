
import PropTypes from 'prop-types'
import { useDeleteDocumentTypeMutation } from '@/apiRTK/documentTypeApi'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteDocumentTypeButton = ({
  documentType,
  onAfterDelete,
  renderTrigger,
}) => {
  const [deleteDocumentType] = useDeleteDocumentTypeMutation()

  const handleRemove = async () => {
    try {
      await deleteDocumentType(documentType.code).unwrap()
      onAfterDelete?.()
      notifySuccess(localize(Localization.DELETE_SUCCESS, { name: documentType.name }))
    } catch (e) {
      const message = RESOURCE_ERROR_TO_DISPLAY[e.data?.code] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_CONFIRM_MESSAGE, { name: documentType.name }),
      onOk: handleRemove,
    })
  }

  return renderTrigger(confirmRemoval)
}

DeleteDocumentTypeButton.propTypes = {
  documentType: documentTypeShape.isRequired,
  onAfterDelete: PropTypes.func,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  DeleteDocumentTypeButton,
}
