
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { Modal } from '@/components/Modal'
import { localize, Localization } from '@/localization/i18n'
import {
  ModalTitle,
  ModalContent,
  Footer,
  InfoMessage,
} from './SaveDocumentTypeModal.styles'

const MODAL_WIDTH = 480

export const SaveDocumentTypeModal = ({
  onSave,
  isDisabled,
  isLoading,
  isVisible,
  toggleModalVisibility,
}) => {
  const [isReextractionNeeded, setIsReextractionNeeded] = useState(true)

  const handlerOnEdit = useCallback(() => {
    onSave(isReextractionNeeded)
  }, [onSave, isReextractionNeeded])

  const handleCancel = useCallback(() => {
    toggleModalVisibility()
    setIsReextractionNeeded(true)
  }, [toggleModalVisibility])

  const FooterComponent = useMemo(() => (
    <Footer>
      <Button.Secondary
        disabled={isLoading}
        onClick={handleCancel}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        loading={isLoading}
        onClick={handlerOnEdit}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.CONFIRM)}
      </Button>
    </Footer>
  ), [
    isLoading,
    handleCancel,
    handlerOnEdit,
  ])

  const Title = useMemo(() => (
    <ModalTitle>
      {localize(Localization.CONFIRM_SAVE_DOCUMENT_TYPE)}
    </ModalTitle>
  ), [])

  return (
    <>
      <Button
        disabled={isDisabled}
        onClick={toggleModalVisibility}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE_DOCUMENT_TYPE)}
      </Button>
      <Modal
        centered
        closable={false}
        destroyOnClose
        footer={FooterComponent}
        keyboard={false}
        maskClosable={false}
        onCancel={handleCancel}
        open={isVisible}
        title={Title}
        width={MODAL_WIDTH}
      >
        <ModalContent>
          <InfoMessage>
            {localize(Localization.DOCUMENT_TYPE_EDIT_INFO_MESSAGE)}
          </InfoMessage>
          <Checkbox
            checked={isReextractionNeeded}
            onChange={setIsReextractionNeeded}
          >
            <InfoMessage>
              {localize(Localization.PERFORM_RE_EXTRACTION_MESSAGE)}
            </InfoMessage>
          </Checkbox>
        </ModalContent>
      </Modal>
    </>
  )
}

SaveDocumentTypeModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toggleModalVisibility: PropTypes.func.isRequired,
}
