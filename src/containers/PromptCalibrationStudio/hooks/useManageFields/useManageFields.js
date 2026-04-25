
import { useCallback } from 'react'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useCreateFields } from './useCreateFields'
import { useUpdateFields } from './useUpdateFields'

const updateFieldsExtractorId = (fields, extractorIdMapping) => (
  fields.map((field) => {
    const extractorId = extractorIdMapping[field.extractorId]

    return {
      ...field,
      extractorId,
    }
  })
)

export const useManageFields = () => {
  const { createFields } = useCreateFields()
  const { updateFields } = useUpdateFields()

  const manageFields = useCallback(async ({
    documentTypeId,
    categorizedFields,
    initialFields,
    extractorIdMapping,
  }) => {
    try {
      const { created, updated } = categorizedFields

      if (created.length) {
        const createdFields = updateFieldsExtractorId(created, extractorIdMapping)
        await createFields(documentTypeId, createdFields)
      }

      if (updated.length) {
        const updatedFields = updateFieldsExtractorId(updated, extractorIdMapping)
        await updateFields(documentTypeId, updatedFields, initialFields)
      }
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
      throw e
    }
  }, [
    createFields,
    updateFields,
  ])

  return {
    manageFields,
  }
}
