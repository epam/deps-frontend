
import { FieldColumn } from '@/containers/DocumentTypeFieldsList/FieldColumn'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { LLMExtractor } from '@/models/LLMExtractor'

const getValidationRules = (field, validators) => {
  const validator = validators.find((v) => v.code === field.code)

  return validator?.rules || []
}

const getCrossFieldValidationRules = (field, crossFieldValidators) => crossFieldValidators
  .filter((rule) => rule.validatedFields.includes(field.code))

export const mapExtractionFieldsToTableData = (fields = [], llmExtractors) => (
  fields.map((field) => {
    const llmExtractor = llmExtractors.find((extractor) => (
      extractor.queries.some((query) => query.code === field.code)),
    )

    const mappedField = {
      ...field,
      [FieldColumn.CATEGORY]: (
        llmExtractor
          ? DocumentTypeFieldCategory.GEN_AI
          : DocumentTypeFieldCategory.EXTRACTION
      ),
    }

    if (llmExtractor) {
      mappedField[FieldColumn.LLM_EXTRACTOR] = llmExtractor
      mappedField[FieldColumn.PROMPT_CHAIN] = LLMExtractor.getQueryNodesFromExtractor(field.code, llmExtractor)
    }

    return mappedField
  })
)

export const mapExtraFieldsToTableData = (fields) => (
  fields.map((field) => ({
    ...field,
    [FieldColumn.CATEGORY]: DocumentTypeFieldCategory.EXTRA,
  }))
)

export const attachValidationRulesToField = (field, validators, crossFieldValidators) => ({
  ...field,
  [FieldColumn.VALIDATION_RULES]: [
    ...getValidationRules(field, validators),
    ...getCrossFieldValidationRules(field, crossFieldValidators),
  ],
})
