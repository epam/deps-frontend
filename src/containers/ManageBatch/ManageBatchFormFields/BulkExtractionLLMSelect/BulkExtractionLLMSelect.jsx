
import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { ExtractionLLMSelect } from '@/containers/ExtractionLLMSelect'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'

export const BulkExtractionLLMSelect = ({ onChange, ...props }) => {
  const { setValue, getValues } = useFormContext()

  const enhancedOnChange = (value) => {
    const files = getValues(FIELD_FORM_CODE.FILES)

    if (files) {
      const currentDocumentType = getValues(FIELD_FORM_CODE.DOCUMENT_TYPE)
      const currentEngine = getValues(FIELD_FORM_CODE.ENGINE)
      const currentLlmType = getValues(FIELD_FORM_CODE.LLM_TYPE)
      const currentParsingFeatures = getValues(FIELD_FORM_CODE.PARSING_FEATURES)

      files.forEach((file, index) => {
        if (
          file.settings.documentType === currentDocumentType &&
          file.settings.engine === currentEngine &&
          file.settings.llmType === currentLlmType &&
          file.settings.parsingFeatures.length === currentParsingFeatures.length &&
          file.settings.parsingFeatures.every((feature) => currentParsingFeatures.includes(feature))
        ) {
          setValue(`${FIELD_FORM_CODE.FILES}.${index}.settings.${FIELD_FORM_CODE.LLM_TYPE}`, value)
        }
      })
    }

    onChange(value)
  }

  return (
    <ExtractionLLMSelect
      {...props}
      onChange={enhancedOnChange}
    />
  )
}

BulkExtractionLLMSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
}
