
import { LabelType } from 'labeling-tool/lib/models/Label'
import { Markup } from 'labeling-tool/lib/models/Markup'
import { FieldType } from '@/enums/FieldType'
import { DocumentType } from '@/models/DocumentType'
import { ExtractedDataField } from '@/models/ExtractedData'
import { mapFieldToMarkup } from './mapFieldToMarkup'
import { mapKeyValuePairToMarkup } from './mapKeyValuePairToMarkup'
import { mapListToMarkup } from './mapListToMarkup'
import { mapTableToMarkup } from './mapTableToMarkup'

const getMapperToMarkup = (edField, docTypeFields, unifiedData) => {
  const dtField = docTypeFields.find((f) => f.pk === edField.fieldPk)

  switch (dtField.fieldType) {
    case FieldType.TABLE:
      return (edField) => mapTableToMarkup(edField.data, dtField.code, unifiedData)

    case FieldType.DICTIONARY:
      return (edField) => mapKeyValuePairToMarkup(edField.data, dtField.code, unifiedData)

    case FieldType.LIST:
      return (edField) => mapListToMarkup(edField, dtField, unifiedData)

    case FieldType.CHECKMARK:
      return (edField) => mapFieldToMarkup(edField.data, dtField.code, unifiedData, undefined, LabelType.CHECKMARK)

    case FieldType.ENUM:
      return (edField) => mapFieldToMarkup(edField.data, dtField.code, unifiedData, undefined, LabelType.ENUM)

    case FieldType.DATE:
      return (edField) => mapFieldToMarkup(edField.data, dtField.code, unifiedData, undefined, LabelType.DATE)

    default:
      return (edField) => mapFieldToMarkup(edField.data, dtField.code, unifiedData, undefined, LabelType.STRING)
  }
}

const mapExtractedDataToMarkup = (extractedData, docTypeFields, unifiedData) => {
  if (!extractedData || !extractedData.length) {
    return null
  }

  const markup = extractedData.reduce((markup, edField) => {
    if (
      !ExtractedDataField.isValid(edField) ||
      !DocumentType.containsFieldWithPk(docTypeFields, edField.fieldPk)
    ) {
      return markup
    }
    const mapper = getMapperToMarkup(edField, docTypeFields, unifiedData)
    const markupChunk = mapper(edField)
    return markupChunk ? Markup.merge(markup, markupChunk) : markup
  }, {})

  if (!Object.keys(markup).length) {
    return null
  }

  return markup
}

export {
  mapExtractedDataToMarkup,
}
