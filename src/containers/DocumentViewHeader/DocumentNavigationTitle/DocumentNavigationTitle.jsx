
import { useCallback, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateDocument } from '@/actions/documentReviewPage'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TextEditorModal } from '@/components/TextEditorModal'
import { Localization, localize } from '@/localization/i18n'
import { documentSelector } from '@/selectors/documentReviewPage'
import { isDocumentTypeFetchingSelector } from '@/selectors/requests'
import { removeFileExtension } from '@/utils/file'
import { getFileExtension } from '@/utils/getFileExtension'
import {
  DocumentType,
  DocumentDataWrapper,
  DocumentStatus,
  DocumentTitle,
  DocumentTitleWrapper,
  InfoSeparator,
  InfoWrapper,
  TableActionIcon,
  Wrapper,
  Spinner,
} from './DocumentNavigationTitle.styles'

const getModalStyle = (container) => {
  const { left, bottom } = container.getBoundingClientRect()

  return {
    left,
    top: bottom,
  }
}

const DocumentNavigationTitle = () => {
  const [isTitleLoading, setIsTitleLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const document = useSelector(documentSelector)
  const isDocumentTypeFetching = useSelector(isDocumentTypeFetchingSelector)
  const dispatch = useDispatch()
  const wrapperRef = useRef(null)

  const extension = getFileExtension(document.title)
  const titleWithoutExtension = removeFileExtension(document.title)

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const openModal = () => {
    setIsModalVisible(true)
  }

  const submitDocumentTitle = useCallback(async (title) => {
    const updatedTitle = title + extension

    if (updatedTitle === document.title) {
      closeModal()
      return
    }

    setIsTitleLoading(true)
    await dispatch(updateDocument({ title: updatedTitle }, document._id))
    setIsTitleLoading(false)
    closeModal()
  }, [
    document.title,
    document._id,
    dispatch,
    extension,
  ])

  return (
    <Wrapper ref={wrapperRef}>
      <DocumentDataWrapper>
        <DocumentTitleWrapper>
          <DocumentTitle
            text={document.title}
          />
          <TableActionIcon
            disabled={isTitleLoading}
            icon={<PenIcon />}
            onClick={openModal}
          />
        </DocumentTitleWrapper>
        <InfoWrapper>
          <DocumentStatus status={document.state} />
          <InfoSeparator />
          <Spinner spinning={isDocumentTypeFetching}>
            <DocumentType text={document.documentType?.name} />
          </Spinner>
        </InfoWrapper>
      </DocumentDataWrapper>
      {
        isModalVisible && (
          <TextEditorModal
            addonAfter={extension}
            isLoading={isTitleLoading}
            onCancel={closeModal}
            onSubmit={submitDocumentTitle}
            placeholder={localize(Localization.ENTER_DOCUMENT_NAME)}
            style={getModalStyle(wrapperRef.current)}
            value={titleWithoutExtension}
          />
        )
      }
    </Wrapper>
  )
}

export {
  DocumentNavigationTitle,
}
