
import PropTypes from 'prop-types'
import { useDeleteDocumentTypeExtractorMutation } from '@/apiRTK/documentTypeApi'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteDocumentTypeExtractorButton = ({
  documentTypeId,
  extractorId,
  extractorName,
  onAfterDelete,
  renderTrigger,
}) => {
  const [deleteDocumentTypeExtractor] = useDeleteDocumentTypeExtractorMutation()

  const handleRemove = async () => {
    try {
      await deleteDocumentTypeExtractor({
        documentTypeId,
        extractorId,
      }).unwrap()
      onAfterDelete?.()
      notifySuccess(localize(Localization.DELETE_SUCCESS, { name: extractorName }))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_CONFIRM_MESSAGE, { name: extractorName }),
      onOk: handleRemove,
    })
  }

  return renderTrigger(confirmRemoval)
}

DeleteDocumentTypeExtractorButton.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
  extractorId: PropTypes.string.isRequired,
  extractorName: PropTypes.string.isRequired,
  onAfterDelete: PropTypes.func,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  DeleteDocumentTypeExtractorButton,
}
