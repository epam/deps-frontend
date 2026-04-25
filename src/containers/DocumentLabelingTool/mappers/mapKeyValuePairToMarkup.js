
import { LabelType, Label } from 'labeling-tool/lib/models/Label'
import { Markup } from 'labeling-tool/lib/models/Markup'
import { DictFieldData, FieldData } from '@/models/ExtractedData'

const addLabel = (markup, page, value) => ({
  ...markup,
  [page]: {
    ...(markup[page] || {}),
    labels: [
      ...((markup[page] && markup[page].labels) || []),
      value,
    ],
  },
})

const mapKeyValuePairToMarkup = (data, fieldCode, unifiedData, index) => {
  if (
    !DictFieldData.isValid(data)
  ) {
    return null
  }

  let markup = new Markup()

  const keyIsValid = FieldData.isValid(data.key) && (data.key.coordinates || !!data.key.sourceBboxCoordinates?.length)

  const getFirstCoordValueByKey = (data, key) => {
    return data.sourceBboxCoordinates?.[0]?.bboxes?.[0]?.[key] ??
    (data.coordinates?.[key] || data.coordinates?.[0]?.[key])
  }

  const keyLabel = keyIsValid && new Label(
    getFirstCoordValueByKey(data.key, 'x'),
    getFirstCoordValueByKey(data.key, 'y'),
    getFirstCoordValueByKey(data.key, 'w'),
    getFirstCoordValueByKey(data.key, 'h'),
    fieldCode,
    index,
    LabelType.KEY,
    data.key.value,
    data,
    data.key.confidence,
  )

  const valueIsValid = FieldData.isValid(data.value) && (data.value.coordinates || !!data.value.sourceBboxCoordinates?.length)

  const valueLabel = valueIsValid && new Label(
    getFirstCoordValueByKey(data.value, 'x'),
    getFirstCoordValueByKey(data.value, 'y'),
    getFirstCoordValueByKey(data.value, 'w'),
    getFirstCoordValueByKey(data.value, 'h'),
    fieldCode,
    index,
    LabelType.VALUE,
    data.value.value,
    data,
    data.value.confidence,
  )

  if (keyLabel) {
    const keyPage = unifiedData && !!data.key.sourceBboxCoordinates?.length
      ? Object.values(unifiedData)
        .flat()
        .find((d) => d.id === data.key.sourceBboxCoordinates?.[0]?.sourceId)
        .page
      : data.key.coordinates.page || data.key.coordinates[0]?.page
    markup = addLabel(markup, keyPage, keyLabel)
  }

  if (valueLabel) {
    const valuePage = unifiedData && !!data.value.sourceBboxCoordinates?.length
      ? Object.values(unifiedData)
        .flat()
        .find((d) => d.id === data.value.sourceBboxCoordinates?.[0]?.sourceId)
        .page
      : data.value.coordinates.page || data.value.coordinates[0]?.page
    markup = addLabel(markup, valuePage, valueLabel)
  }

  return markup
}

export {
  mapKeyValuePairToMarkup,
}
