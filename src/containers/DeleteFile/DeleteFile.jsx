
import { useDeleteFilesMutation } from '@/apiRTK/filesApi'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { Modal } from '@/components/Modal'
import { TableActionIcon } from '@/components/TableActionIcon'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { fileShape } from '@/models/File'
import { notifyWarning } from '@/utils/notification'

export const DeleteFile = ({ file }) => {
  const [
    deleteFiles,
    { isLoading },
  ] = useDeleteFilesMutation()

  const handleDelete = async () => {
    try {
      await deleteFiles([file.id]).unwrap()
    } catch (e) {
      const message = RESOURCE_ERROR_TO_DISPLAY[e.data?.code] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
    }
  }

  const confirmRemoval = (e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.DELETE_FILE_CONFIRM_MESSAGE),
      onOk: handleDelete,
    })
  }

  const isActionDisabled = isLoading || file.state.status === FileStatus.PROCESSING

  return (
    <TableActionIcon
      disabled={isActionDisabled}
      icon={<TrashIcon />}
      onClick={confirmRemoval}
    />
  )
}

DeleteFile.propTypes = {
  file: fileShape.isRequired,
}
