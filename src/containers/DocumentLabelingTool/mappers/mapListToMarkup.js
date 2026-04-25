import { LabelType } from 'labeling-tool/lib/models/Label'
import { Markup } from 'labeling-tool/lib/models/Markup'
import { FieldType } from '@/enums/FieldType'
import { ListField } from '@/models/ExtractedData'
import { mapFieldToMarkup } from './mapFieldToMarkup'
import { mapKeyValuePairToMarkup } from './mapKeyValuePairToMarkup'
import { mapTableToMarkup } from './mapTableToMarkup'

const getMapperToMarkup = (dtField) => {
  switch (dtField.fieldMeta.baseType) {
    case FieldType.TABLE:
      return mapTableToMarkup
    case FieldType.DICTIONARY:
      return mapKeyValuePairToMarkup
    case FieldType.CHECKMARK:
      return (data, fieldCode, unifiedData, index) => mapFieldToMarkup(data, fieldCode, unifiedData, index, LabelType.CHECKMARK)
    case FieldType.ENUM:
      return (data, fieldCode, unifiedData, index) => mapFieldToMarkup(data, fieldCode, unifiedData, index, LabelType.ENUM)
    default:
      return (data, fieldCode, unifiedData, index) => mapFieldToMarkup(data, fieldCode, unifiedData, index, LabelType.STRING)
  }
}

const mapListToMarkup = (edField, dtField, unifiedData) => {
  if (!ListField.isValid(edField)) {
    return null
  }

  const markupChunks = edField.data.map((subEdField, index) => {
    const mapper = getMapperToMarkup(dtField)
    return mapper(subEdField, dtField.code, unifiedData, index + 1)
  })

  return markupChunks.reduce(
    (markup, markupChunk) => (
      markupChunk ? Markup.merge(markup, markupChunk) : markup
    ), new Markup(),
  )
}

export {
  mapListToMarkup,
}
