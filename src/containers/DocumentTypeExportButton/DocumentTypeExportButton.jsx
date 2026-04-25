
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/Button'
import { ArrowDownSolidIcon } from '@/components/Icons/ArrowDownSolidIcon'
import { Tooltip } from '@/components/Tooltip'
import { EXPORT_FIELDS } from '@/constants/documentType'
import { FileExtension } from '@/enums/FileExtension'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractors } from '@/models/LLMExtractor'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { saveToFile } from '@/utils/file'

const getGenAIFields = (fields, extractors) => fields
  .map((field) => {
    const extractor = LLMExtractors.getExtractorByQueryCode(field.code, extractors)
    return {
      ...field,
      extractorId: extractor?.extractorId,
    }
  })
  .filter((field) => field && field.extractorId)

const getCrossValidators = (crossFieldValidators, fieldsCodes) =>
  crossFieldValidators.filter((validator) => validator.validatedFields.every((code) => fieldsCodes.includes(code)))

const buildExportObject = (documentType) => {
  const genAIFields = getGenAIFields(documentType.fields, documentType.llmExtractors)
  const genAIFieldsCodes = genAIFields.map((field) => field.code)

  return {
    [EXPORT_FIELDS.NAME]: documentType.name,
    [EXPORT_FIELDS.DESCRIPTION]: documentType.description,
    [EXPORT_FIELDS.ENGINE]: documentType.engine,
    [EXPORT_FIELDS.EXTRACTION_TYPE]: documentType.extractionType,
    [EXPORT_FIELDS.LANGUAGE]: documentType.language,
    [EXPORT_FIELDS.GEN_AI_FIELDS]: genAIFields,
    [EXPORT_FIELDS.CROSS_FIELD_VALIDATORS]: getCrossValidators(documentType.crossFieldValidators, genAIFieldsCodes),
    [EXPORT_FIELDS.LLM_EXTRACTORS]: documentType.llmExtractors,
  }
}

const DocumentTypeExportButton = () => {
  const documentType = useSelector(documentTypeStateSelector)
  const isLoading = useSelector(isDocumentTypeFetchingSelector)
  const buttonRef = useRef(null)

  const exportDocumentType = () => {
    const exportObject = buildExportObject(documentType)
    saveToFile(`${documentType.name}${FileExtension.JSON}`, 'UTF-8', JSON.stringify(exportObject))
    buttonRef.current.blur()
  }

  return (
    <Tooltip title={localize(Localization.EXPORT_DOCUMENT_TYPE)}>
      <Button.Secondary
        ref={buttonRef}
        disabled={isLoading}
        icon={<ArrowDownSolidIcon />}
        onClick={exportDocumentType}
      />
    </Tooltip>
  )
}

export {
  DocumentTypeExportButton,
}
