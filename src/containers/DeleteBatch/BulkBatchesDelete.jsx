
import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelection } from '@/actions/navigation'
import {
  useDeleteBatchesMutation,
  useDeleteBatchesWithDocumentsMutation,
} from '@/apiRTK/batchesApi'
import { Checkbox } from '@/components/Checkbox'
import { Modal } from '@/components/Modal'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { selectionSelector } from '@/selectors/navigation'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { Wrapper } from './DeleteBatch.styles'

const TEST_ID = {
  DELETE_ASSOCIATED_DOCS: 'delete-associated-docs',
}

const BulkBatchesDelete = ({
  renderTrigger,
}) => {
  const dispatch = useDispatch()
  const selectedBatches = useSelector(selectionSelector)

  const [visible, setVisible] = useState(false)
  const [deleteAssociatedDocs, setDeleteAssociatedDocs] = useState(false)

  const [deleteBatches] = useDeleteBatchesMutation()
  const [deleteBatchesWithDocuments] = useDeleteBatchesWithDocumentsMutation()

  const handleDelete = useCallback(async () => {
    try {
      if (deleteAssociatedDocs) {
        await deleteBatchesWithDocuments({ ids: selectedBatches }).unwrap()
      } else {
        await deleteBatches({ ids: selectedBatches }).unwrap()
      }

      dispatch(setSelection(null))
      notifySuccess(localize(Localization.DELETE_COMPLETED))
    } catch (e) {
      const errorCode = e.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DELETE_FAILED)
      notifyWarning(message)
    } finally {
      setVisible(false)
    }
  }, [
    selectedBatches,
    deleteAssociatedDocs,
    deleteBatches,
    deleteBatchesWithDocuments,
    dispatch,
  ])

  const toggleModal = useCallback((e) => {
    e.stopPropagation()
    setVisible((prev) => !prev)
  }, [])

  const title = localize(
    Localization.DELETE_BATCHES_COUNT_CONFIRM_TITLE,
    { count: selectedBatches.length },
  )

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

BulkBatchesDelete.propTypes = {
  renderTrigger: PropTypes.func.isRequired,
}

export {
  BulkBatchesDelete,
}
