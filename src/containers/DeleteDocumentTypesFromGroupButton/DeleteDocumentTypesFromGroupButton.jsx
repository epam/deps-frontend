
import PropTypes from 'prop-types'
import { useDeleteDocumentTypesFromGroupMutation } from '@/apiRTK/documentTypesGroupsApi'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteDocumentTypesFromGroupButton = ({
  documentTypeIds,
  groupId,
  renderTrigger,
  onAfterDelete,
}) => {
  const [deleteDocumentTypes] = useDeleteDocumentTypesFromGroupMutation()

  const handleRemove = async () => {
    try {
      await deleteDocumentTypes({
        id: documentTypeIds,
        groupId,
      }).unwrap()
      onAfterDelete?.()
      notifySuccess(localize(Localization.SELECTED_DOCUMENT_TYPES_SUCCESS_DELETION))
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_SELECTED_DOCUMENT_TYPES_FROM_GROUP),
      onOk: handleRemove,
    })
  }

  return renderTrigger(confirmRemoval)
}

DeleteDocumentTypesFromGroupButton.propTypes = {
  groupId: PropTypes.string.isRequired,
  documentTypeIds: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  onAfterDelete: PropTypes.func,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  DeleteDocumentTypesFromGroupButton,
}
