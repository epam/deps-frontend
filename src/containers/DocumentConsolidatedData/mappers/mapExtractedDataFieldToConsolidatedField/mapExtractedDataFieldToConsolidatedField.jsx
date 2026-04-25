
import { DocumentConsolidatedField } from '@/containers/DocumentConsolidatedData/DocumentConsolidatedField'
import { FieldAdapter } from '@/containers/FieldAdapter'
import { DocumentState } from '@/enums/DocumentState'
import { DocumentValidation } from '@/models/DocumentValidation'
import { LLMExtractor, LLMExtractors } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'

export const mapExtractedDataFieldToConsolidatedField = ({
  edField,
  documentState,
  documentValidation,
  documentType,
  activeFieldPk,
}) => {
  const dtField = documentType.fields.find((dtf) => dtf.pk === edField.fieldPk)
  const { code, order, name, fieldType, fieldMeta } = dtField

  const isReviewDisabled = (
    documentState !== DocumentState.IN_REVIEW ||
    (ENV.FEATURE_FIELDS_DISPLAY_MODE && dtField.readOnly)
  )

  const fieldValidation = DocumentValidation.getFieldValidation(documentValidation, dtField.code)
  const fieldExtractor = LLMExtractors.getExtractorByQueryCode(dtField.code, documentType.llmExtractors)
  const promptChain = fieldExtractor && LLMExtractor.getQueryNodesFromExtractor(dtField.code, fieldExtractor)

  return new DocumentConsolidatedField({
    code,
    name,
    order,
    type: fieldType,
    baseType: fieldMeta?.baseType,
    render: () => (
      <FieldAdapter
        active={edField.fieldPk === activeFieldPk}
        disabled={isReviewDisabled}
        dtField={dtField}
        edField={edField}
        promptChain={promptChain}
        validation={fieldValidation}
      />
    ),
  })
}
