
import PropTypes from 'prop-types'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { DocTypeSelect } from '../DocTypeSelect'

export const BulkDocTypeSelect = ({ onChange, ...props }) => {
  const documentTypes = useSelector(documentTypesSelector)

  const { setValue, getValues } = useFormContext()

  const enhancedOnChange = (value) => {
    const documentType = documentTypes.find(({ code }) => code === value)

    const targetEngine = documentType?.engine
    const targetLlmType = documentType?.llmType

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
          setValue(`${FIELD_FORM_CODE.FILES}.${index}.settings.${FIELD_FORM_CODE.DOCUMENT_TYPE}`, value)
          setValue(`${FIELD_FORM_CODE.FILES}.${index}.settings.${FIELD_FORM_CODE.ENGINE}`, targetEngine)
          setValue(`${FIELD_FORM_CODE.FILES}.${index}.settings.${FIELD_FORM_CODE.LLM_TYPE}`, targetLlmType)
        }
      })
    }

    setValue(FIELD_FORM_CODE.ENGINE, targetEngine)
    setValue(FIELD_FORM_CODE.LLM_TYPE, targetLlmType)

    onChange(value)
  }

  return (
    <DocTypeSelect
      {...props}
      onChange={enhancedOnChange}
    />
  )
}

BulkDocTypeSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
}
