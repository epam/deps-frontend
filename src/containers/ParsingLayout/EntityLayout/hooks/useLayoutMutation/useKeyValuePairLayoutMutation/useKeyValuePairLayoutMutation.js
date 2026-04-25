
import { useMemo } from 'react'
import { useUpdateKeyValuePairMutation } from '@/apiRTK/documentLayoutApi'
import { useUpdateFileKeyValuePairMutation } from '@/apiRTK/fileLayoutApi'
import { useLayoutData, LAYOUT_TYPE_TO_ENTITY_ID_KEY } from '@/containers/ParsingLayout/EntityLayout/hooks'

export const useKeyValuePairLayoutMutation = ({ isEditable }) => {
  const {
    layoutId,
    layoutType,
    isFile,
  } = useLayoutData()

  const [updateKeyValuePair] = useUpdateKeyValuePairMutation()
  const [updateFileKeyValuePair] = useUpdateFileKeyValuePairMutation()

  const updateKeyValuePairCallback = useMemo(() => {
    const mutation = isFile ? updateFileKeyValuePair : updateKeyValuePair
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
    updateFileKeyValuePair,
    updateKeyValuePair,
    isEditable,
    layoutId,
    isFile,
  ])

  return {
    updateKeyValuePair: updateKeyValuePairCallback,
  }
}
