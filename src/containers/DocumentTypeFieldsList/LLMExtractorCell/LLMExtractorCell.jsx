
import { useCallback, useMemo } from 'react'
import { LongText } from '@/components/LongText'
import { ExtractorLLMType } from '@/containers/ExtractorLLMType'
import { llmExtractorShape } from '@/models/LLMExtractor'
import { ExtractionName, LLMType } from './LLMExtractorCell.styles'

const LLMExtractorCell = ({ llmExtractor }) => {
  const renderLLMType = useCallback((extractorName) => (
    <LLMType>
      {extractorName}
    </LLMType>
  ), [])

  const Content = useMemo(() => (
    <div>
      <ExtractionName>
        <LongText text={llmExtractor.name} />
      </ExtractionName>
      <ExtractorLLMType
        llmReference={llmExtractor.llmReference}
        render={renderLLMType}
      />
    </div>
  ),
  [llmExtractor, renderLLMType],
  )

  return Content
}

LLMExtractorCell.propTypes = {
  llmExtractor: llmExtractorShape.isRequired,
}

export {
  LLMExtractorCell,
}
