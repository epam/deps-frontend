
import { useCallback } from 'react'
import { mapNodesToRequestedInsights, mapResponseValue } from '@/containers/PromptCalibrationStudio/mappers'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useFieldCalibration } from '../useFieldCalibration'
import { useRetrieveInsights } from '../useRetrieveInsights'

export const useExtractFieldsValues = () => {
  const {
    fields,
    batchUpdateFields,
    activeField,
  } = useFieldCalibration()

  const [
    retrieveInsights,
    isRetrievingInsights,
  ] = useRetrieveInsights()

  const extractFieldsValues = useCallback(async (extractor) => {
    try {
      const fieldsToUpdate = fields.filter((field) => (
        field.extractorId === extractor.id && field.id !== activeField.id
      ))

      if (!fieldsToUpdate.length) {
        return
      }

      const requestedInsightsMap = fieldsToUpdate.reduce((acc, field) => {
        if (field.query.nodes.length) {
          const fieldInsights = mapNodesToRequestedInsights(field, field.query.nodes)

          return {
            ...acc,
            ...fieldInsights,
          }
        }

        return acc
      }, {})

      if (!Object.keys(requestedInsightsMap).length) {
        return
      }

      const {
        model,
        customInstruction,
        ...params
      } = extractor

      const elements = await retrieveInsights({
        model,
        requestedInsights: requestedInsightsMap,
        customInstructions: customInstruction,
        params,
      }).unwrap()

      const updatedFieldsMap = fieldsToUpdate.reduce((acc, field) => {
        const elementData = elements[field.id]

        if (elementData?.errorOccurred) {
          notifyWarning(elementData.content)
          return acc
        }

        if (elementData?.content) {
          const extractedValue = mapResponseValue(elementData.content)
          acc[field.id] = {
            ...field,
            value: extractedValue.value,
          }
        }

        return acc
      }, {})

      if (Object.keys(updatedFieldsMap).length) {
        batchUpdateFields(updatedFieldsMap)
      }
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)

      notifyWarning(message)
    }
  }, [
    fields,
    retrieveInsights,
    activeField.id,
    batchUpdateFields,
  ])

  return {
    extractFieldsValues,
    isRetrievingInsights,
  }
}
