
import { useCallback, useState } from 'react'
import { documentsApi } from '@/api/documentsApi'
import { Localization, localize } from '@/localization/i18n'
import { ExtractedDataField } from '@/models/ExtractedData'
import { notifyWarning } from '@/utils/notification'
import { useFieldProps } from '../useFieldProps'

const useListItemsAliases = (dtField, edField, documentId) => {
  const [isSaving, setIsSaving] = useState(false)
  const { setField } = useFieldProps(dtField, edField)

  const onSave = useCallback(async (fieldToUpdate, newAlias) => {
    setIsSaving(true)
    try {
      const listField = await documentsApi.saveEdField({
        aliases: edField.aliases,
        data: edField.data,
        fieldPk: edField.fieldPk,
        documentPk: documentId,
      })

      const itemIndex = fieldToUpdate.data.index
      const subField = listField.data[itemIndex]
      const updatedAliases = {
        [subField.id]: newAlias,
      }

      await documentsApi.updateFieldAliases({
        documentId,
        fieldCode: edField.fieldPk,
        updatedAliases,
      })

      const updatedListField = ExtractedDataField.updateFieldAliases(listField, updatedAliases)
      setField(updatedListField)
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR))
    } finally {
      setIsSaving(false)
    }
  },
  [
    edField,
    documentId,
    setField,
  ])

  return {
    isSaving,
    onSave,
  }
}

export {
  useListItemsAliases,
}
