
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFetchBatchQuery } from '@/apiRTK/batchesApi'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { DeleteSingleBatch } from '@/containers/DeleteBatch'
import { DeleteBatchFiles } from '@/containers/DeleteBatchFiles'
import { AddFilesToBatchDrawerButton } from '@/containers/ManageBatch/AddFilesToBatchDrawerButton'
import { Localization, localize } from '@/localization/i18n'
import { selectionSelector } from '@/selectors/navigation'
import { StyledButton } from './BatchActions.styles'

export const BatchActions = () => {
  const { id } = useParams()

  const selectedBatchFiles = useSelector(selectionSelector)

  const { data, isFetching } = useFetchBatchQuery(id)

  const renderDeleteBatchTrigger = useCallback((onClick) => (
    <StyledButton onClick={onClick}>
      <TrashIcon />
      {localize(Localization.DELETE_BATCH)}
    </StyledButton>
  ), [])

  const renderDeleteBatchFilesTrigger = useCallback((onClick) => (
    <StyledButton onClick={onClick}>
      <TrashIcon />
      {localize(Localization.DELETE)}
    </StyledButton>
  ), [])

  if (isFetching) {
    return null
  }

  if (selectedBatchFiles.length) {
    return (
      <DeleteBatchFiles
        renderTrigger={renderDeleteBatchFilesTrigger}
      />
    )
  }

  return (
    <>
      <DeleteSingleBatch
        batch={data}
        renderTrigger={renderDeleteBatchTrigger}
      />
      <AddFilesToBatchDrawerButton />
    </>
  )
}
