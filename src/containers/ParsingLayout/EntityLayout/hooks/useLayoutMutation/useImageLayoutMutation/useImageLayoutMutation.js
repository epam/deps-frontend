
import { useMemo } from 'react'
import { useUpdateImageMutation } from '@/apiRTK/documentLayoutApi'
import { useUpdateFileImageMutation } from '@/apiRTK/fileLayoutApi'
import { useLayoutData, LAYOUT_TYPE_TO_ENTITY_ID_KEY } from '@/containers/ParsingLayout/EntityLayout/hooks'

export const useImageLayoutMutation = ({ isEditable }) => {
  const {
    layoutId,
    layoutType,
    isFile,
  } = useLayoutData()

  const [updateImage] = useUpdateImageMutation()
  const [updateFileImage] = useUpdateFileImageMutation()

  const updateImageCallback = useMemo(() => {
    const mutation = isFile ? updateFileImage : updateImage

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
    updateFileImage,
    updateImage,
    isEditable,
    layoutId,
    isFile,
  ])

  return {
    updateImage: updateImageCallback,
  }
}
