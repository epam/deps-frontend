
import PropTypes from 'prop-types'
import { useCreateOrUpdateSupplementsMutation } from '@/apiRTK/documentSupplementsApi'
import { Modal } from '@/components/Modal'
import { Tooltip } from '@/components/Tooltip'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { documentSupplementShape } from '@/models/DocumentSupplement'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const { ItemButton } = ActionsMenu

const DeleteFieldButton = ({
  disabled,
  documentId,
  documentTypeCode,
  documentSupplements,
  isDocumentTypeField,
  supplement,
}) => {
  const [
    createOrUpdateSupplements,
    { isLoading },
  ] = useCreateOrUpdateSupplementsMutation()

  const tooltipTitle = isDocumentTypeField && localize(Localization.SUPPLEMENT_FIELD_DELETION_IS_NOT_ALLOWED)

  const isActionDisabled = isLoading || disabled || isDocumentTypeField

  const handleRemove = async () => {
    try {
      const data = documentSupplements.filter((f) => f.code !== supplement.code)
      const documentTypeId = documentTypeCode === UNKNOWN_DOCUMENT_TYPE.code ? null : documentTypeCode

      await createOrUpdateSupplements({
        documentId,
        documentTypeId,
        data,
      }).unwrap()

      notifySuccess(localize(
        Localization.DELETE_SUCCESS,
        { name: supplement.name },
      ))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    }
  }

  const confirmRemoval = () => {
    Modal.confirm({
      title: localize(Localization.DELETE_FIELD_CONFIRM_MESSAGE),
      onOk: handleRemove,
    })
  }

  return (
    <Tooltip
      placement={Placement.TOP_RIGHT}
      title={tooltipTitle}
    >
      <ItemButton
        disabled={isActionDisabled}
        onClick={confirmRemoval}
      >
        {localize(Localization.DELETE)}
      </ItemButton>
    </Tooltip>
  )
}

DeleteFieldButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  documentId: PropTypes.string.isRequired,
  documentTypeCode: PropTypes.string.isRequired,
  documentSupplements: PropTypes.arrayOf(
    documentSupplementShape,
  ).isRequired,
  isDocumentTypeField: PropTypes.bool.isRequired,
  supplement: documentSupplementShape,
}

export {
  DeleteFieldButton,
}
