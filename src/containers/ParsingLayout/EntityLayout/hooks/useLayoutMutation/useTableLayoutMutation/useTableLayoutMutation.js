
import { useMemo } from 'react'
import { useUpdateTableMutation } from '@/apiRTK/documentLayoutApi'
import { useUpdateFileTableMutation } from '@/apiRTK/fileLayoutApi'
import { useLayoutData, LAYOUT_TYPE_TO_ENTITY_ID_KEY } from '@/containers/ParsingLayout/EntityLayout/hooks'

export const useTableLayoutMutation = ({ isEditable }) => {
  const {
    layoutId,
    layoutType,
    isFile,
  } = useLayoutData()

  const [updateTable] = useUpdateTableMutation()
  const [updateFileTable] = useUpdateFileTableMutation()

  const updateTableCallback = useMemo(() => {
    const mutation = isFile ? updateFileTable : updateTable
    const idKey = LAYOUT_TYPE_TO_ENTITY_ID_KEY[layoutType]

    return async (params) => {
      if (!isEditable) {
        return
      }

      await mutation({
        [idKey]: layoutId,
        ...params,
      }).unwrap()
    }
  }, [
    layoutType,
    updateFileTable,
    updateTable,
    isEditable,
    layoutId,
    isFile,
  ])

  return {
    updateTable: updateTableCallback,
  }
}
