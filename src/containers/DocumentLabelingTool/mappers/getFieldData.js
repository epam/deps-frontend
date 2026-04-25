
import { FieldType } from '@/enums/FieldType'
import { FieldData } from '@/models/ExtractedData'
import { extractDataAreaWithAlgorithm } from '@/services/OCRExtractionService'
import { ENV } from '@/utils/env'

export const getFieldData = async ({
  fieldId,
  labelCoords,
  blobName,
  engine,
  language,
  label,
  sourceBboxCoordinates,
  setIndex,
  extractDataArea,
}) => {
  try {
    let extractedData

    if (
      ENV.FEATURE_OCR_INTERSECTION_ALGORITHM &&
      label.type !== FieldType.CHECKMARK
    ) {
      extractedData = await extractDataAreaWithAlgorithm({
        language,
        engine,
        blobName,
        labelCoords,
      })
    } else {
      extractedData = await extractDataArea(
        labelCoords,
        blobName,
        engine,
        language,
      )
    }

    const { content, confidence } = extractedData

    return new FieldData(
      content,
      labelCoords,
      confidence,
      null,
      undefined,
      null,
      sourceBboxCoordinates,
      undefined,
      setIndex,
      null,
      fieldId,
    )
  } catch {
    return new FieldData(
      label.content,
      labelCoords,
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
  }
}
