
import isEmpty from 'lodash/isEmpty'
import {
  Field,
  KeyValuePairValue,
  ListItemValue,
  Query,
  SUPPORTED_BASE_FIELD_TYPES,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { LLMExtractor, LLMExtractors } from '@/models/LLMExtractor'

const getFieldValue = ({
  data,
  fieldType,
  isList,
  aliases,
}) => {
  if (fieldType === FieldType.DICTIONARY && isList) {
    return (
      data?.map((item) => ListItemValue.create(
        KeyValuePairValue.create(item.key.value, item.value.value),
        aliases?.[item.id],
      )) ??
      [ListItemValue.create(KeyValuePairValue.create())]
    )
  }

  if (fieldType === FieldType.DICTIONARY) {
    return KeyValuePairValue.create(data?.key.value, data?.value.value)
  }

  if (isList) {
    return (
      data?.map((item) => ListItemValue.create(item.value ?? '', aliases?.[item.id])) ??
      [ListItemValue.create('')]
    )
  }

  return data?.value ?? ''
}

export const mapGenAiFieldsToStudioFields = (extractedData, documentType) => {
  const fields = documentType.extractionFields || []

  return fields
    .filter((field) => (
      LLMExtractors.getExtractorByQueryCode(field.code, documentType.llmExtractors) &&
      SUPPORTED_BASE_FIELD_TYPES.includes(field.fieldMeta?.baseType ?? field.fieldType)
    ))
    .toSorted((a, b) => a.order - b.order)
    .map((field) => {
      const {
        code,
        confidential,
        fieldType,
        fieldMeta,
        name,
        readOnly,
        required,
        order,
      } = field

      const isList = fieldType === FieldType.LIST

      const fieldExtractor = LLMExtractors.getExtractorByQueryCode(code, documentType.llmExtractors)
      const nodes = LLMExtractor.getQueryNodesFromExtractor(code, fieldExtractor)
      const multiplicity = Field.getFieldMultiplicity(fieldType)
      const fieldBaseType = isList ? fieldMeta.baseType : fieldType
      const { aliases, data } = extractedData.find((data) => data.fieldCode === code) ?? {}

      const value = getFieldValue({
        data,
        fieldType: fieldBaseType,
        isList,
        aliases,
      })

      return new Field({
        id: code,
        aliases: !isEmpty(aliases),
        confidential: confidential,
        extractorId: fieldExtractor.extractorId,
        fieldType: fieldBaseType,
        multiplicity,
        name,
        readOnly,
        required,
        value,
        query: new Query({
          id: code,
          nodes,
        }),
        order,
      })
    })
}
