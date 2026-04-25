
import { useMemo, useCallback } from 'react'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { TableActionIcon } from '@/components/TableActionIcon'
import { DeleteSingleBatch } from '@/containers/DeleteBatch'
import { batchShape } from '@/models/Batch'
import { CommandBar } from './BatchesCommandBar.styles'

const BatchesCommandBar = ({ batch }) => {
  const renderTrigger = useCallback((onClick) => (
    <TableActionIcon
      icon={<TrashIcon />}
      onClick={onClick}
    />
  ), [])

  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <DeleteSingleBatch
          batch={batch}
          renderTrigger={renderTrigger}
        />
      ),
    },
  ], [batch, renderTrigger])

  return (
    <CommandBar commands={commands} />
  )
}

BatchesCommandBar.propTypes = {
  batch: batchShape.isRequired,
}

export {
  BatchesCommandBar,
}
