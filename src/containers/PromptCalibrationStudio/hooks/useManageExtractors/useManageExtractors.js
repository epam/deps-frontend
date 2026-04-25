
import { useCallback } from 'react'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useCreateExtractors } from './useCreateExtractors'
import { useUpdateExtractors } from './useUpdateExtractors'

export const useManageExtractors = () => {
  const { createExtractors } = useCreateExtractors()
  const { updateExtractors } = useUpdateExtractors()

  const manageExtractors = useCallback(async ({
    documentTypeId,
    documentTypeName,
    categorizedExtractors,
    initialExtractors,
  }) => {
    try {
      const { created, updated } = categorizedExtractors

      let extractorIdMapping = initialExtractors?.reduce((acc, extractor) => {
        acc[extractor.id] = extractor.id
        return acc
      }, {}) ?? {}

      if (created.length) {
        const createdExtractorIdMapping = await createExtractors(documentTypeName, created)

        extractorIdMapping = {
          ...extractorIdMapping,
          ...createdExtractorIdMapping,
        }
      }

      if (updated.length) {
        await updateExtractors(documentTypeId, updated, initialExtractors)
      }

      return extractorIdMapping
    } catch (e) {
      const errorCode = e?.data?.code
      const message = RESOURCE_ERROR_TO_DISPLAY[errorCode] ?? localize(Localization.DEFAULT_ERROR)
      notifyWarning(message)
      throw e
    }
  }, [createExtractors, updateExtractors])

  return {
    manageExtractors,
  }
}
