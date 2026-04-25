
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  useDeleteBatchesMutation,
  useDeleteBatchesWithDocumentsMutation,
} from '@/apiRTK/batchesApi'
import { Checkbox } from '@/components/Checkbox'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { batchShape } from '@/models/Batch'
import { navigationMap } from '@/utils/navigationMap'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { goTo } from '@/utils/routerActions'
import { Wrapper } from './DeleteBatch.styles'

const TEST_ID = {
  DELETE_ASSOCIATED_DOCS: 'delete-associated-docs',
}

const DeleteSingleBatch = ({
  batch,
  renderTrigger,
}) => {
  const { id } = useParams()

  const [visible, setVisible] = useState(false)
  const [deleteAssociatedDocs, setDeleteAssociatedDocs] = useState(false)

  const isBatchPageOpened = !!id

  const [deleteBatches] = useDeleteBatchesMutation()
  const [deleteBatchesWithDocuments] = useDeleteBatchesWithDocumentsMutation()

  const handleDelete = useCallback(async () => {
    try {
      if (deleteAssociatedDocs) {
        await deleteBatchesWithDocuments({ ids: [batch.id] }).unwrap()
      } else {
        await deleteBatches({ ids: [batch.id] }).unwrap()
      }

      if (isBatchPageOpened) {
        goTo(navigationMap.batches())
      }
      notifySuccess(localize(Localization.DELETE_COMPLETED))
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DELETE_FAILED)
      notifyWarning(message)
    } finally {
      setVisible(false)
    }
  }, [
    batch.id,
    deleteAssociatedDocs,
    deleteBatches,
    deleteBatchesWithDocuments,
    isBatchPageOpened,
  ])

  const toggleModal = useCallback((e) => {
    e.stopPropagation()
    setVisible((prev) => !prev)
  }, [])

  const title = localize(Localization.DELETE_BATCH_CONFIRM_TITLE, { name: batch.name })

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

DeleteSingleBatch.propTypes = {
  batch: batchShape.isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export {
  DeleteSingleBatch,
}
