
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { fetchDocumentType } from '@/actions/documentType'
import { PlusCircleIcon } from '@/components/Icons/PlusCircleIcon'
import { AddLLMExtractorModalButton } from '@/containers/AddLLMExtractorModalButton'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { Localization, localize } from '@/localization/i18n'
import { extendedDocumentTypeShape } from '@/models/ExtendedDocumentType'
import { LLMExtractorsList } from '../LLMExtractorsList'
import {
  CreateLLMExtractorButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from './SetLLMExtractorButton.styles'

const CONTAINER_MARGIN = 8

const getModalStyle = (container) => {
  if (!container) {
    return {}
  }

  const { left, top, width, height } = container.getBoundingClientRect()

  return {
    top: top + height + CONTAINER_MARGIN,
    left,
    width,
    margin: 0,
  }
}

const SetLLMExtractorButton = ({
  containerRef,
  onChange,
  renderTrigger,
  documentType,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch()
  const { llmExtractors } = documentType

  const refreshData = useCallback(() => {
    dispatch(fetchDocumentType(
      documentType.code,
      [DocumentTypeExtras.LLM_EXTRACTORS],
    ))
  }, [
    documentType.code,
    dispatch,
  ])

  const toggleModal = useCallback(() => {
    setIsModalVisible((prevIsVisible) => !prevIsVisible)
  }, [setIsModalVisible])

  const triggerOnClick = useCallback(() => setIsModalVisible(true), [setIsModalVisible])

  const container = containerRef.current
  const { width, ...restStyleProps } = useMemo(() => getModalStyle(container), [container])

  const onExtractorChange = useCallback((extractorId) => {
    onChange(extractorId)
    toggleModal()
  }, [onChange, toggleModal])

  const renderAddLLMExtractorTrigger = useCallback((onClick) => (
    <CreateLLMExtractorButton
      onClick={onClick}
    >
      <PlusCircleIcon />
      {localize(Localization.CREATE_LLM_EXTRACTOR)}
    </CreateLLMExtractorButton>
  ), [])

  const Content = useMemo(() => (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>
          {localize(Localization.LLM_EXTRACTORS_LIST)}
        </ModalTitle>
        <AddLLMExtractorModalButton
          documentTypeName={documentType.name}
          onAfterAdding={refreshData}
          renderTrigger={renderAddLLMExtractorTrigger}
        />
      </ModalHeader>
      <ModalBody>
        <LLMExtractorsList
          llmExtractors={llmExtractors}
          onChange={onExtractorChange}
        />
      </ModalBody>
    </ModalContent>
  ), [
    llmExtractors,
    onExtractorChange,
    renderAddLLMExtractorTrigger,
    refreshData,
    documentType.name,
  ])

  return (
    <>
      {renderTrigger(triggerOnClick)}
      <Modal
        closable={false}
        footer={null}
        getContainer={() => container?.parentNode}
        onCancel={toggleModal}
        open={isModalVisible}
        style={{ ...restStyleProps }}
        width={width}
      >
        {Content}
      </Modal>
    </>
  )
}

SetLLMExtractorButton.propTypes = {
  containerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onChange: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func.isRequired,
  documentType: extendedDocumentTypeShape.isRequired,
}

export {
  SetLLMExtractorButton,
}
