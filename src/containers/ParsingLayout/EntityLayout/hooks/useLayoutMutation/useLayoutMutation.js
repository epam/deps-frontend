
import { useMemo } from 'react'
import { useLayoutData } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { FileStatus } from '@/enums/FileStatus'
import { ENV } from '@/utils/env'
import { useImageLayoutMutation } from './useImageLayoutMutation'
import { useKeyValuePairLayoutMutation } from './useKeyValuePairLayoutMutation'
import { useParagraphLayoutMutation } from './useParagraphLayoutMutation'
import { useTableLayoutMutation } from './useTableLayoutMutation'

export const useLayoutMutation = (parsingType) => {
  const {
    document,
    file,
    isFile,
  } = useLayoutData()

  const isDocumentEditable = useMemo(() => (
    ENV.FEATURE_DOCUMENT_LAYOUT_EDITING &&
    parsingType === DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED &&
    document?.state === DocumentState.IN_REVIEW
  ), [parsingType, document?.state])

  const isFileEditable = useMemo(() => (
    ENV.FEATURE_FILE_LAYOUT_EDITING &&
    parsingType === DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED &&
    file?.state?.status === FileStatus.COMPLETED
  ), [parsingType, file?.state?.status])

  const isEditable = isFile ? isFileEditable : isDocumentEditable

  const mutations = {
    ...useParagraphLayoutMutation({ isEditable }),
    ...useTableLayoutMutation({ isEditable }),
    ...useImageLayoutMutation({ isEditable }),
    ...useKeyValuePairLayoutMutation({ isEditable }),
  }

  return {
    isEditable,
    ...mutations,
  }
}
