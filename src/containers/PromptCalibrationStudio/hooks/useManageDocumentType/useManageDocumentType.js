
import { useCallback, useState } from 'react'
import { mapFieldsAndExtractorsToCategorized } from '@/containers/PromptCalibrationStudio/mappers'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { useManageExtractors } from '../useManageExtractors'
import { useManageFields } from '../useManageFields'
import { useCreateDocumentType } from './useCreateDocumentType'

export const useManageDocumentType = () => {
  const [isManaging, setIsManaging] = useState(false)

  const { createDocType } = useCreateDocumentType()
  const { manageFields } = useManageFields()
  const { manageExtractors } = useManageExtractors()

  const manageDocumentType = useCallback(async (data) => {
    try {
      setIsManaging(true)

      const {
        documentTypeId,
        documentTypeName,
        fields,
        initialFields,
        extractors,
        initialExtractors,
      } = data

      let typeId = documentTypeId

      if (!typeId) {
        const response = await createDocType(documentTypeName)
        typeId = response.documentTypeId
      }

      const fieldsWithNodesAndOrder = (
        fields
          .filter((field) => field.query.nodes.length)
          .map((field, order) => ({
            ...field,
            order,
          }))
      )

      const {
        categorizedFields,
        categorizedExtractors,
      } = mapFieldsAndExtractorsToCategorized({
        currentFields: fieldsWithNodesAndOrder,
        initialFields,
        currentExtractors: extractors,
        initialExtractors,
      })

      const extractorIdMapping = await manageExtractors({
        documentTypeId: typeId,
        documentTypeName,
        categorizedExtractors,
        initialExtractors,
      })

      await manageFields({
        documentTypeId: typeId,
        categorizedFields,
        initialFields,
        extractorIdMapping,
      })

      notifySuccess(localize(Localization.DOCUMENT_TYPE_COMMIT_SUCCESS_MESSAGE))
    } catch (e) {
      notifyWarning(localize(Localization.DOCUMENT_TYPE_COMMIT_ERROR_MESSAGE))
    } finally {
      setIsManaging(false)
    }
  }, [
    manageExtractors,
    manageFields,
    createDocType,
  ])

  return {
    manageDocumentType,
    isManaging,
  }
}
