
import { useCallback } from 'react'
import { createDocumentType } from '@/api/documentTypesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType } from '@/enums/ExtractionType'
import { localize, Localization } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'

export const useCreateDocumentType = () => {
  const createDocType = useCallback(async (documentTypeName) => {
    try {
      const { documentTypeId } = await createDocumentType({
        name: documentTypeName,
        extractorType: ExtractionType.AI_PROMPTED,
      })

      return {
        documentTypeId,
        documentTypeName,
      }
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
      throw e
    }
  }, [])

  return {
    createDocType,
  }
}
