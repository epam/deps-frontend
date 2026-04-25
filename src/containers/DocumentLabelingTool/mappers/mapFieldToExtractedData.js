
import { documentsApi } from '@/api/documentsApi'
import { getExtractedFieldData } from './getExtractedFieldData'
import { getFieldData } from './getFieldData'
import { getFieldId } from './getFieldId'

const mapFieldToExtractedData = async ({
  markupToProcess,
  processingDocuments,
  language,
  engine,
  withoutExtraction,
  unifiedData,
  edField,
}) => {
  const extractedData = []

  for await (const [page, label] of markupToProcess) {
    const data = await getExtractedFieldData({
      fieldId: getFieldId(edField, label.index),
      label,
      page,
      processingDocuments,
      language,
      engine,
      withoutExtraction,
      unifiedData,
      extractDataArea: (args) => getFieldData({
        ...args,
        extractDataArea: documentsApi.extractDataArea,
      }),
    })

    extractedData.push(data)
  }

  return extractedData
}

export { mapFieldToExtractedData }
