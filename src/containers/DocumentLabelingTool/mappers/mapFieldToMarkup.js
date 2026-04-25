
import { Label } from 'labeling-tool/lib/models/Label'
import { Markup, PageMarkup } from 'labeling-tool/lib/models/Markup'
import { FieldData } from '@/models/ExtractedData'

const mapFieldToMarkup = (data, fieldCode, unifiedData, index, fieldType) => {
  if (
    !FieldData.isValid(data) ||
    (!data.coordinates && !data.sourceBboxCoordinates?.length)
  ) {
    return null
  }

  const getFirstCoordValueByKey = (data, key) => {
    return data.sourceBboxCoordinates?.[0]?.bboxes?.[0]?.[key] ??
    (data.coordinates?.[key] || data.coordinates?.[0]?.[key])
  }

  const label = new Label(
    getFirstCoordValueByKey(data, 'x'),
    getFirstCoordValueByKey(data, 'y'),
    getFirstCoordValueByKey(data, 'w'),
    getFirstCoordValueByKey(data, 'h'),
    fieldCode,
    index,
    fieldType,
    data.value,
    data,
    data.confidence,
  )

  const pageMarkup = new PageMarkup(label)

  const page = unifiedData && !!data.sourceBboxCoordinates?.length
    ? Object.values(unifiedData)
      .flat()
      .find((d) => d.id === data.sourceBboxCoordinates[0].sourceId)
      .page
    : data.coordinates.page || data.coordinates[0]?.page

  const markup = new Markup(new Map([[page, pageMarkup]]))

  return markup
}

export { mapFieldToMarkup }
