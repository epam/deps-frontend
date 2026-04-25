
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { BulkBatchesDelete } from '@/containers/DeleteBatch'
import { AddBatchDrawerButton } from '@/containers/ManageBatch/AddBatchDrawerButton'
import { Localization, localize } from '@/localization/i18n'
import { selectionSelector } from '@/selectors/navigation'
import { RefreshBatches } from '../RefreshBatches'
import { ResetBatches } from '../ResetBatches'
import { StyledButton } from './BatchesPageActions.styles'

export const BatchesPageActions = ({ refetch }) => {
  const selectedBatches = useSelector(selectionSelector)

  const renderDeleteBatchesTrigger = useCallback((onClick) => (
    <StyledButton onClick={onClick}>
      <TrashIcon />
      {localize(Localization.DELETE)}
    </StyledButton>
  ), [])

  if (selectedBatches.length) {
    return (
      <BulkBatchesDelete
        renderTrigger={renderDeleteBatchesTrigger}
      />
    )
  }

  return (
    <>
      <RefreshBatches refetch={refetch} />
      <ResetBatches />
      <AddBatchDrawerButton />
    </>
  )
}

BatchesPageActions.propTypes = {
  refetch: PropTypes.func.isRequired,
}
