
import { Localization, localize } from '@/localization/i18n'
import { FieldColumn } from '../FieldColumn'
import { LLMExtractorCell } from '../LLMExtractorCell'

const generateFieldLLMExtractor = () => ({
  title: localize(Localization.LLM_EXTRACTOR),
  dataIndex: FieldColumn.LLM_EXTRACTOR,
  render: (_, field) => (
    field.llmExtractor && (
      <LLMExtractorCell
        llmExtractor={field.llmExtractor}
      />
    )
  ),
})

export {
  generateFieldLLMExtractor,
}
