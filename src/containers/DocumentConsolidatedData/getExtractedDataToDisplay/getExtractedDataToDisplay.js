
import { ExtractedDataField } from '@/models/ExtractedData'

const getEdFieldToDisplay = (edField) =>
  Array.isArray(edField.data)
    ? ExtractedDataField.setIndexToData(edField)
    : edField

const getExtractedDataToDisplay = ({
  extractedData,
  documentType,
  ShouldHideEmptyEdFields,
}) =>
  documentType.fields.reduce((fields, dtf) => {
    const edField = extractedData?.find((edf) => edf.fieldPk === dtf.pk)

    if (edField) {
      fields.push(getEdFieldToDisplay(edField))
      return fields
    }

    if (!ShouldHideEmptyEdFields?.(documentType.code)) {
      const newEdField = new ExtractedDataField(
        dtf.pk,
        ExtractedDataField.getEmptyData(dtf),
        null,
        ExtractedDataField.getEmptyAliases(dtf),
      )

      fields.push(getEdFieldToDisplay(newEdField))
    }

    return fields
  }, [])

export {
  getExtractedDataToDisplay,
}
