
import PropTypes from 'prop-types'
import { memo } from 'react'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { DeleteDocumentTypeExtractorButton } from '@/containers/DeleteDocumentTypeExtractorButton'
import { EditLLMExtractorModalButton } from '@/containers/EditLLMExtractorModalButton'
import { llmExtractorShape } from '@/models/LLMExtractor'
import { CommandBar, TableActionIcon } from './LLMExtractorCommandBar.styles'

const LLMExtractorCommandBar = memo(({
  documentTypeId,
  llmExtractor,
  refreshData,
}) => {
  const renderEditButton = (onClick) => (
    <TableActionIcon
      icon={<PenIcon />}
      onClick={onClick}
    />
  )

  const renderDeleteButton = (onClick) => (
    <TableActionIcon
      icon={<TrashIcon />}
      onClick={onClick}
    />
  )

  const commands = [
    {
      renderComponent: () => (
        <EditLLMExtractorModalButton
          documentTypeId={documentTypeId}
          llmExtractor={llmExtractor}
          onAfterEditing={refreshData}
          renderTrigger={renderEditButton}
        />
      ),
    },
    {
      renderComponent: () => (
        <DeleteDocumentTypeExtractorButton
          documentTypeId={documentTypeId}
          extractorId={llmExtractor.extractorId}
          extractorName={llmExtractor.name}
          onAfterDelete={refreshData}
          renderTrigger={renderDeleteButton}
        />
      ),
    },
  ]

  return (
    <CommandBar commands={commands} />
  )
})

LLMExtractorCommandBar.propTypes = {
  documentTypeId: PropTypes.string.isRequired,
  llmExtractor: llmExtractorShape.isRequired,
  refreshData: PropTypes.func.isRequired,
}

export {
  LLMExtractorCommandBar,
}
