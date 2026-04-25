
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useDeleteDocumentTypesGroupMutation } from '@/apiRTK/documentTypesGroupsApi'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'
import { selectionSelector } from '@/selectors/navigation'
import { notifySuccess, notifyWarning } from '@/utils/notification'

const DeleteDocumentTypesGroupButton = ({
  group,
  renderTrigger,
  onAfterDelete,
}) => {
  const selectedGroups = useSelector(selectionSelector)

  const [deleteDocumentTypesGroup] = useDeleteDocumentTypesGroupMutation()

  const handleRemove = async () => {
    try {
      const groupsIds = group?.id ? [group.id] : selectedGroups
      await deleteDocumentTypesGroup({ id: groupsIds }).unwrap()
      onAfterDelete?.()

      notifySuccess(
        group
          ? localize(Localization.DOC_TYPES_GROUP_SUCCESS_DELETION, { name: group.name })
          : localize(Localization.DOC_TYPES_GROUPS_SUCCESS_DELETION),
      )
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    const title = (
      group?.id
        ? localize(Localization.DELETE_DOC_TYPES_GROUP, { name: group.name })
        : localize(Localization.DELETE_DOC_TYPES_GROUPS)
    )

    Modal.confirm({
      title,
      onOk: handleRemove,
    })
  }

  return renderTrigger(confirmRemoval)
}

DeleteDocumentTypesGroupButton.propTypes = {
  group: documentTypesGroupShape,
  renderTrigger: PropTypes.func.isRequired,
  onAfterDelete: PropTypes.func,
}

export {
  DeleteDocumentTypesGroupButton,
}
