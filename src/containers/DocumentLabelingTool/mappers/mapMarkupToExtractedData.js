
import { FieldType } from '@/enums/FieldType'
import { ExtractedData, ExtractedDataField } from '@/models/ExtractedData'
import { getPipeDataToProcess } from './getPipeDataToProcess'
import { mapCheckmarkLabelToExtractedData } from './mapCheckmarkLabelToExtractedData'
import { mapFieldToExtractedData } from './mapFieldToExtractedData'
import { mapKeyValueLabelToExtractedData } from './mapKeyValueLabelToExtractedData'
import { mapTableToExtractedData } from './mapTableToExtractedData'

const getMapperToExtractedFieldData = (dtField) => {
  switch (dtField.fieldType) {
    case FieldType.TABLE:
      return mapTableToExtractedData

    case FieldType.DICTIONARY:
      return mapKeyValueLabelToExtractedData

    case FieldType.CHECKMARK:
      return mapCheckmarkLabelToExtractedData

    case FieldType.LIST: {
      const fieldType = dtField.fieldMeta.baseType
      return getMapperToExtractedFieldData({ fieldType })
    }

    default:
      return mapFieldToExtractedData
  }
}

const getExtractedDataField = (data, dtField, aliases = {}) => {
  if (dtField.fieldType === FieldType.LIST) {
    const subFieldIds = new Set(data.map((item) => item.id))
    const newAliases = Object.fromEntries(
      Object.entries(aliases).filter(([id]) => subFieldIds.has(id)),
    )

    return new ExtractedDataField(
      dtField.pk,
      data,
      null,
      newAliases,
    )
  } else {
    return new ExtractedDataField(dtField.pk, data[0])
  }
}

const mapMarkupToExtractedData = async (
  markup,
  documentType,
  processingDocuments,
  language,
  engine,
  withoutExtraction,
  unifiedData,
  extractedData,
) => {
  if (!markup) {
    return []
  }

  const pipeData = getPipeDataToProcess(markup, documentType.fields)

  return Promise.all(
    pipeData.map(async ({ dtField, markupToProcess }) => {
      const mapper = getMapperToExtractedFieldData(dtField)
      const edField = ExtractedData.getFieldByPk(extractedData, dtField.pk)

      const edFieldData = await mapper({
        markupToProcess,
        processingDocuments,
        language,
        engine,
        withoutExtraction,
        unifiedData,
        edField,
      })

      return getExtractedDataField(edFieldData, dtField, edField?.aliases)
    }),
  )
}

export {
  mapMarkupToExtractedData,
}
