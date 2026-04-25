import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFetchBatchQuery, usePatchBatchMutation } from '@/apiRTK/batchesApi'
import { Button } from '@/components/Button'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TextEditorModal } from '@/components/TextEditorModal'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { notifyWarning } from '@/utils/notification'
import { BatchActions } from './BatchActions'
import { BatchGroupInfo } from './BatchGroupInfo'
import {
  Column,
  Wrapper,
} from './BatchPageHeader.styles'

const TEST_ID = {
  EDIT_BATCH_NAME: 'edit-batch-name',
}

const getModalStyle = (container) => {
  if (!container) return {}

  const { left, bottom } = container.getBoundingClientRect()
  return {
    left,
    top: bottom,
  }
}

export const BatchPageHeader = () => {
  const { id: batchId } = useParams()

  const wrapperRef = useRef(null)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const { data } = useFetchBatchQuery(batchId)

  const [batchName, setBatchName] = useState(data.name)

  const [patchBatch, { isLoading }] = usePatchBatchMutation()

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const openModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  const submitDocumentTitle = useCallback(async (name) => {
    if (name === batchName) {
      closeModal()
      return
    }

    try {
      await patchBatch({
        batchId,
        data: { name },
      }).unwrap()
      setBatchName(name)
    } catch {
      notifyWarning(localize(Localization.FAILED_TO_UPDATE_BATCH_NAME))
    } finally {
      closeModal()
    }
  }, [
    batchId,
    batchName,
    patchBatch,
    closeModal,
  ])

  const ExtraHeader = useCallback(
    () => (
      <Wrapper>
        <Column>
          <Button.Secondary
            data-testid={TEST_ID.EDIT_BATCH_NAME}
            disabled={isLoading}
            icon={<PenIcon />}
            onClick={openModal}
          />
          <BatchGroupInfo />
        </Column>
        <Column>
          <BatchActions />
        </Column>
      </Wrapper>
    ),
    [isLoading, openModal],
  )

  return (
    <div ref={wrapperRef}>
      {
        isModalVisible && (
          <TextEditorModal
            isLoading={isLoading}
            onCancel={closeModal}
            onSubmit={submitDocumentTitle}
            placeholder={localize(Localization.ENTER_BATCH_NAME)}
            style={getModalStyle(wrapperRef.current)}
            value={batchName}
          />
        )
      }
      <PageNavigationHeader
        parentPath={navigationMap.batches()}
        renderExtra={ExtraHeader}
        title={batchName}
      />
    </div>
  )
}
