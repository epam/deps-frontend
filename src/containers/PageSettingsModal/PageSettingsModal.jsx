
import PropTypes from 'prop-types'
import {
  useState,
  useMemo,
  useCallback,
} from 'react'
import { useSelector } from 'react-redux'
import { ButtonType, Button } from '@/components/Button'
import { localize, Localization } from '@/localization/i18n'
import { Document } from '@/models/Document'
import { documentSelector } from '@/selectors/documentReviewPage'
import { PageRangeSelectors } from './PageRangeSelectors'
import {
  CloseIcon,
  Title,
  Description,
  Modal,
  ModalHeaderWrapper,
  ModalFooterWrapper,
  SubmitButton,
} from './PageSettingsModal.styles'

const DEFAULT_MODAL_STYLE = {
  right: '3rem',
  top: '5rem',
}

const createPagesList = (pagesQuantity) => {
  const documentPages = []
  for (let i = 1; i <= pagesQuantity; i++) {
    documentPages.push(i.toString())
  }

  return documentPages
}

const validatePageRange = ([startPage, endPage], [minStartPage, maxEndPage]) => {
  const isStartPageValid = (Number(startPage) >= Number(minStartPage)) &&
    (Number(startPage) <= Number(endPage)) &&
    (Number(startPage) <= Number(maxEndPage))

  const isEndPageValid = (Number(endPage) >= Number(minStartPage)) &&
    (Number(endPage) >= Number(startPage)) &&
    (Number(endPage) <= Number(maxEndPage))

  return isStartPageValid && isEndPageValid
}

const PageSettingsModal = ({
  activePageRange,
  modalStyle,
  onAfterToggle,
  onPageRangeChange,
  renderTrigger,
}) => {
  const document = useSelector(documentSelector)
  const pagesQuantity = Document.getPagesQuantity(document)
  const documentPages = createPagesList(pagesQuantity)
  const minStartPage = documentPages[0]
  const maxEndPage = documentPages[pagesQuantity - 1]

  const initialPageRange = useMemo(() => [
    activePageRange[0] || minStartPage,
    activePageRange[1] || maxEndPage,
  ],
  [
    minStartPage,
    maxEndPage,
    activePageRange,
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [pageRange, setPageRange] = useState(initialPageRange)
  const [isPageRangeValid, setIsPageRangeValid] = useState(true)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

  const toggleModal = useCallback(() => {
    setIsModalVisible((prevIsVisible) => !prevIsVisible)
    onAfterToggle && onAfterToggle()
  }, [onAfterToggle, setIsModalVisible])

  const onReset = useCallback(() => {
    setPageRange([minStartPage, maxEndPage])
    setIsPageRangeValid(true)
    setIsSubmitDisabled(true)
    onPageRangeChange([])
  }, [
    maxEndPage,
    minStartPage,
    onPageRangeChange,
    setPageRange,
    setIsPageRangeValid,
  ])

  const onModalClose = useCallback(() => {
    setPageRange(initialPageRange)
    setIsPageRangeValid(true)
    toggleModal()
  }, [
    initialPageRange,
    setPageRange,
    setIsPageRangeValid,
    toggleModal,
  ])

  const onSubmit = useCallback(() => {
    onPageRangeChange(pageRange)
    toggleModal()
  }, [
    pageRange,
    onPageRangeChange,
    toggleModal,
  ])

  const onChangeStartPage = useCallback((value) => {
    const [, endPage] = pageRange
    setPageRange([value, endPage])
    const validationResult = validatePageRange(
      [value, endPage],
      [minStartPage, maxEndPage],
    )
    setIsPageRangeValid(validationResult)
    setIsSubmitDisabled(false)
  }, [
    maxEndPage,
    minStartPage,
    pageRange,
    setPageRange,
    setIsPageRangeValid,
  ])

  const onChangeEndPage = useCallback((value) => {
    const [startPage] = pageRange
    setPageRange([startPage, value])
    const validationResult = validatePageRange(
      [startPage, value],
      [minStartPage, maxEndPage],
    )
    setIsPageRangeValid(validationResult)
    setIsSubmitDisabled(false)
  }, [
    maxEndPage,
    minStartPage,
    pageRange,
    setPageRange,
    setIsPageRangeValid,
  ])

  const onModalButtonClick = useCallback(() => {
    if (isModalVisible) {
      onModalClose()
      return
    }

    toggleModal()
    setIsSubmitDisabled(true)
  }, [
    isModalVisible,
    onModalClose,
    toggleModal,
  ])

  const isSubmitButtonDisabled = isSubmitDisabled || !isPageRangeValid

  const ModalHeader = useMemo(() => (
    <ModalHeaderWrapper>
      <div>
        <Title>
          {localize(Localization.PAGE_RANGE)}
        </Title>
        <Description>
          {localize(Localization.PAGE_RANGE_TITLE_DESCRIPTION)}
        </Description>
      </div>
      <CloseIcon
        aria-label={localize(Localization.CLOSE)}
        onClick={onModalClose}
      />
    </ModalHeaderWrapper>
  ), [onModalClose])

  const ModalFooter = useMemo(() => (
    <ModalFooterWrapper>
      <Button.Secondary
        onClick={onReset}
      >
        {localize(Localization.RESET)}
      </Button.Secondary>
      <SubmitButton
        disabled={isSubmitButtonDisabled}
        onClick={onSubmit}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </SubmitButton>
    </ModalFooterWrapper>
  ), [
    isSubmitButtonDisabled,
    onReset,
    onSubmit,
  ])

  return (
    <>
      {renderTrigger(onModalButtonClick)}
      {
        isModalVisible && (
          <Modal
            style={modalStyle || DEFAULT_MODAL_STYLE}
          >
            {ModalHeader}
            <PageRangeSelectors
              documentPages={documentPages}
              isPageRangeValid={isPageRangeValid}
              onChangeEndPage={onChangeEndPage}
              onChangeStartPage={onChangeStartPage}
              pageRange={pageRange}
            />
            {ModalFooter}
          </Modal>
        )
      }
    </>
  )
}

PageSettingsModal.propTypes = {
  activePageRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  modalStyle: PropTypes.shape({
    bottom: PropTypes.number,
    right: PropTypes.number,
  }),
  onAfterToggle: PropTypes.func,
  onPageRangeChange: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired,
}

export { PageSettingsModal }
