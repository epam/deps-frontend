
import { LabelType } from 'labeling-tool/lib/models/Label'
import { documentsApi } from '@/api/documentsApi'
import { FieldData, DictFieldData } from '@/models/ExtractedData'
import { getExtractedFieldData } from './getExtractedFieldData'
import { getFieldData } from './getFieldData'
import { getFieldId } from './getFieldId'

const mapKeyValueLabelToExtractedData = async ({
  markupToProcess,
  processingDocuments,
  language,
  engine,
  withoutExtraction,
  unifiedData,
  edField,
}) => {
  const processedLabels = []
  const extractedData = []

  for await (const [page, label] of markupToProcess) {
    if (processedLabels.some((procLabel) => procLabel === label)) {
      // eslint-disable-next-line no-continue
      continue
    }

    const pairMarkup = markupToProcess.find(([, labelToProcess]) =>
      labelToProcess.index === label.index &&
      labelToProcess.fieldCode === label.fieldCode &&
      labelToProcess.type !== label.type,
    )

    const pageMarkupToProcess = [[page, label]]

    if (pairMarkup) {
      pageMarkupToProcess.push(pairMarkup)
      const [, pairLabel] = pairMarkup
      processedLabels.push(pairLabel)
    }

    let keyData = new FieldData()
    let valueData = new FieldData()
    let fieldId

    for await (const [page, label] of pageMarkupToProcess) {
      fieldId = getFieldId(edField, label.index)

      const data = await getExtractedFieldData({
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

      if (label.type === LabelType.KEY) {
        keyData = data
      } else {
        valueData = data
      }
    }

    const dictData = new DictFieldData(keyData, valueData, fieldId)
    extractedData.push(dictData)
  }

  return extractedData
}

export { mapKeyValueLabelToExtractedData }
