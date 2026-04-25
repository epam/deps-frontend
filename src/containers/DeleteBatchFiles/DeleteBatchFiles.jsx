
import PropTypes from 'prop-types'
import { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  useDeleteBatchFilesMutation,
  useDeleteBatchFilesWithDocumentsMutation,
  useFetchBatchQuery,
  useDeleteBatchesMutation,
  useDeleteBatchesWithDocumentsMutation,
} from '@/apiRTK/batchesApi'
import { Checkbox } from '@/components/Checkbox'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { batchFileShape } from '@/models/Batch'
import { selectionSelector } from '@/selectors/navigation'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { Wrapper } from './DeleteBatchFiles.styles'

const TEST_ID = {
  DELETE_ASSOCIATED_DOCS: 'delete-associated-docs',
}

export const DeleteBatchFiles = ({
  file,
  renderTrigger,
}) => {
  const { id: batchId } = useParams()

  const [visible, setVisible] = useState(false)

  const [deleteAssociatedDocs, setDeleteAssociatedDocs] = useState(false)

  const { data: batch } = useFetchBatchQuery(batchId)

  const selectedBatchFiles = useSelector(selectionSelector)

  const [deleteBatchFiles] = useDeleteBatchFilesMutation()

  const [deleteBatchFilesWithDocuments] = useDeleteBatchFilesWithDocumentsMutation()

  const [deleteBatches] = useDeleteBatchesMutation()

  const [deleteBatchesWithDocuments] = useDeleteBatchesWithDocumentsMutation()

  const fileIds = useMemo(() => (
    selectedBatchFiles.length ? selectedBatchFiles : [file.id]
  ), [file?.id, selectedBatchFiles])

  const deleteCallback = useCallback(async () => {
    if (batch.files.length === fileIds.length) {
      const deleteCb = deleteAssociatedDocs ? deleteBatchesWithDocuments : deleteBatches
      await deleteCb({ ids: [batchId] }).unwrap()
      goTo(navigationMap.batches())
      return
    }

    const deleteCb = deleteAssociatedDocs ? deleteBatchFilesWithDocuments : deleteBatchFiles
    await deleteCb({
      batchId,
      fileIds,
    }).unwrap()
  }, [
    batch.files.length,
    batchId,
    deleteAssociatedDocs,
    deleteBatchFiles,
    deleteBatchesWithDocuments,
    deleteBatches,
    deleteBatchFilesWithDocuments,
    fileIds,
  ])

  const handleDelete = useCallback(async () => {
    try {
      await deleteCallback()

      notifySuccess(localize(Localization.DELETE_COMPLETED))
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DELETE_FAILED)
      notifyWarning(message)
    } finally {
      setVisible(false)
    }
  }, [deleteCallback])

  const title = useMemo(() => {
    if (batch.files.length === fileIds.length) {
      return localize(Localization.DELETE_BATCH_CONFIRM_TITLE, { name: batch.name })
    }

    if (selectedBatchFiles.length) {
      return localize(Localization.DELETE_BATCH_FILES_CONFIRM_TITLE)
    }

    return localize(Localization.DELETE_BATCH_FILE_CONFIRM_CONTENT, {
      name: file.name,
    })
  }, [
    batch.files.length,
    batch.name,
    file?.name,
    fileIds.length,
    selectedBatchFiles.length,
  ])

  const toggleModal = useCallback((e) => {
    e.stopPropagation()
    setVisible((prev) => !prev)
  }, [])

  return (
    <>
      {renderTrigger(toggleModal)}
      <Modal
        centered
        maskClosable
        modalRender={
          (modal) => (
            <div onClick={(e) => e.stopPropagation()}>{modal}</div>
          )
        }
        okText={localize(Localization.CONFIRM)}
        onCancel={toggleModal}
        onOk={handleDelete}
        open={visible}
        title={title}
      >
        <Wrapper>
          <Checkbox
            checked={deleteAssociatedDocs}
            data-testid={TEST_ID.DELETE_ASSOCIATED_DOCS}
            onChange={setDeleteAssociatedDocs}
          />
          {localize(Localization.REMOVE_CORRESPONDING_DOCUMENTS)}
        </Wrapper>
      </Modal>
    </>
  )
}

DeleteBatchFiles.propTypes = {
  file: batchFileShape,
  renderTrigger: PropTypes.func.isRequired,
}
