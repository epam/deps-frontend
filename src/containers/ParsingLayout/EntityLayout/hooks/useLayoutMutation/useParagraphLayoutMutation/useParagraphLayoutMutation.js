
import { useMemo } from 'react'
import { useUpdateParagraphMutation } from '@/apiRTK/documentLayoutApi'
import { useUpdateFileParagraphMutation } from '@/apiRTK/fileLayoutApi'
import { useLayoutData, LAYOUT_TYPE_TO_ENTITY_ID_KEY } from '@/containers/ParsingLayout/EntityLayout/hooks'

export const useParagraphLayoutMutation = ({ isEditable }) => {
  const {
    layoutId,
    layoutType,
    isFile,
  } = useLayoutData()

  const [updateParagraph] = useUpdateParagraphMutation()
  const [updateFileParagraph] = useUpdateFileParagraphMutation()

  const updateParagraphCallback = useMemo(() => {
    const mutation = isFile ? updateFileParagraph : updateParagraph
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
    updateFileParagraph,
    updateParagraph,
    isEditable,
    layoutId,
    isFile,
  ])

  return {
    updateParagraph: updateParagraphCallback,
  }
}
