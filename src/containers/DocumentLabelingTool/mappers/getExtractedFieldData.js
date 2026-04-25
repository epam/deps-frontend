import isEqual from 'lodash/isEqual'
import { Document } from '@/models/Document'
import { FieldData } from '@/models/ExtractedData'
import { FieldCoordinates } from '@/models/FieldCoordinates'
import { Rect } from '@/models/Rect'
import { SourceBboxCoordinates } from '@/models/SourceCoordinates'

const getExtractedFieldData = async ({
  fieldId,
  label,
  page,
  processingDocuments,
  language,
  engine,
  withoutExtraction,
  unifiedData,
  extractDataArea,
}) => {
  const coords = new FieldCoordinates(page, label.x, label.y, label.w, label.h)
  const { id } = unifiedData?.[page]?.filter((d) => !!d.blobName)?.at(-1) ?? {}
  const setIndex = label.meta?.[label.type]?.setIndex || label.meta.setIndex || null

  const sourceBboxCoordinates = id && [
    new SourceBboxCoordinates(
      id,
      page,
      [
        new Rect(
          label.x,
          label.y,
          label.w,
          label.h,
        ),
      ],
    ),
  ]

  let data = new FieldData(
    label.content,
    coords,
    label.confidence,
    null,
    undefined,
    null,
    sourceBboxCoordinates,
    undefined,
    setIndex,
    null,
    fieldId,
  )

  if (withoutExtraction) {
    return data
  }

  const metaCoords = label.meta?.[label.type]?.coordinates ?? label.meta?.coordinates
  const prevCoords = metaCoords && new FieldCoordinates(
    metaCoords.page,
    metaCoords.x,
    metaCoords.y,
    metaCoords.w,
    metaCoords.h,
  )

  const metaSourceBbox = label.meta?.[label.type]?.sourceBboxCoordinates ?? label.meta?.sourceBboxCoordinates
  const prevSourceBbox = metaSourceBbox && [
    new SourceBboxCoordinates(
      id,
      page,
      [
        new Rect(
          +(metaSourceBbox[0].bboxes[0].x).toFixed(12),
          +(metaSourceBbox[0].bboxes[0].y).toFixed(12),
          +(metaSourceBbox[0].bboxes[0].w).toFixed(12),
          +(metaSourceBbox[0].bboxes[0].h).toFixed(12),
        ),
      ],
    ),
  ]

  const shouldExtractFieldData = sourceBboxCoordinates && prevSourceBbox
    ? !isEqual(prevSourceBbox, sourceBboxCoordinates)
    : !isEqual(prevCoords, coords)

  if (extractDataArea && shouldExtractFieldData) {
    const blobName = Document.getBlobNameByPage({ unifiedData }, page) ?? processingDocuments[page]?.blobName

    data = await extractDataArea({
      fieldId,
      labelCoords: coords,
      blobName,
      engine,
      language,
      label,
      sourceBboxCoordinates,
      setIndex,
    })
  }

  return data
}

export { getExtractedFieldData }
