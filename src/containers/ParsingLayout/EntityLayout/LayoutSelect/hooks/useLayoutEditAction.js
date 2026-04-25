
import { useDispatch } from 'react-redux'
import { startReview } from '@/actions/documentReviewPage'
import { useCreateUserDocumentLayoutMutation } from '@/apiRTK/documentLayoutApi'
import { useCreateUserFileLayoutMutation } from '@/apiRTK/fileLayoutApi'
import { Modal } from '@/components/Modal'
import { LAYOUT_TYPE_TO_ENTITY_ID_KEY, useLayoutData } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { localize, Localization } from '@/localization/i18n'
import { DocumentLayoutInfo } from '@/models/DocumentParsingInfo'

export const useLayoutEditAction = (rawParsingInfoData) => {
  const dispatch = useDispatch()

  const {
    layoutId,
    layoutType,
    isFile,
    document,
  } = useLayoutData()

  const [createUserDocumentLayout] = useCreateUserDocumentLayoutMutation()
  const [createUserFileLayout] = useCreateUserFileLayoutMutation()

  const isDocumentInCompletedState = document?.state === DocumentState.COMPLETED

  const hasUserDefinedParsingType = (
    !!rawParsingInfoData?.documentLayoutInfo &&
    DocumentLayoutInfo.getParsingType(rawParsingInfoData.documentLayoutInfo).includes(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED)
  )

  const createEditableCopy = (parsingType) => new Promise((resolve) => {
    const createMutation = isFile ? createUserFileLayout : createUserDocumentLayout
    const idKey = LAYOUT_TYPE_TO_ENTITY_ID_KEY[layoutType]

    if (hasUserDefinedParsingType) {
      Modal.confirm({
        title: localize(Localization.REPLACE_EXISTING_COPY_TITLE),
        content: localize(Localization.REPLACE_EXISTING_COPY_CONTENT),
        okText: localize(Localization.CONFIRM),
        cancelText: localize(Localization.CANCEL),
        onCancel: () => {
          resolve(false)
        },
        onOk: async () => {
          await createMutation({
            [idKey]: layoutId,
            parsingType,
          }).unwrap()
          resolve(true)
        },
      })
      return
    }

    createMutation({
      [idKey]: layoutId,
      parsingType,
    }).unwrap()
      .then(() => {
        resolve(true)
      })
  })

  const handleEditAction = (parsingType) => new Promise((resolve) => {
    if (isFile) {
      createEditableCopy(parsingType).then((done) => resolve(done))
      return
    }

    if (isDocumentInCompletedState) {
      Modal.confirm({
        title: localize(Localization.COPY_FOR_EDITING_CONFIRM_TITLE),
        content: localize(Localization.COPY_FOR_EDITING_CONFIRM_CONTENT),
        okText: localize(Localization.CONFIRM),
        cancelText: localize(Localization.CANCEL),
        onCancel: () => resolve(false),
        onOk: async () => {
          await dispatch(startReview(layoutId))
          const done = await createEditableCopy(parsingType)
          resolve(done)
        },
      })
      return
    }

    createEditableCopy(parsingType).then((done) => resolve(done))
  })

  return {
    handleEditAction,
  }
}
