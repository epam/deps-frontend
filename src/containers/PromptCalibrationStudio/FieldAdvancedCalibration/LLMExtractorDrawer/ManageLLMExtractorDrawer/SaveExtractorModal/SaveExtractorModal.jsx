
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { ProgressModal } from '@/containers/ProgressModal'
import { localize, Localization } from '@/localization/i18n'
import {
  ModalTitle,
  ModalContent,
  Footer,
  InfoMessage,
  CreateNewButton,
} from './SaveExtractorModal.styles'

const MODAL_WIDTH = 480
const DEFAULT_TOTAL = 1
const DEFAULT_CURRENT = 0

export const SaveExtractorModal = ({
  isVisible,
  isLoading,
  onCreateNew,
  onEditExisting,
  onClose,
}) => {
  const ModalFooter = useMemo(() => (
    <Footer>
      <Button.Secondary
        disabled={isLoading}
        onClick={onClose}
      >
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <CreateNewButton
        disabled={isLoading}
        onClick={onCreateNew}
      >
        {localize(Localization.CREATE_NEW_EXTRACTOR)}
      </CreateNewButton>
      <Button
        loading={isLoading}
        onClick={onEditExisting}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.EDIT_EXISTING_EXTRACTOR)}
      </Button>
    </Footer>
  ), [
    isLoading,
    onCreateNew,
    onEditExisting,
    onClose,
  ])

  const Title = useMemo(() => (
    <ModalTitle>
      {localize(Localization.CONFIRM_SAVE_EXTRACTOR_CHANGES)}
    </ModalTitle>
  ), [])

  return (
    <>
      <Modal
        centered
        closable={false}
        destroyOnClose
        footer={ModalFooter}
        maskClosable={false}
        onClose={onClose}
        open={isVisible}
        title={Title}
        width={MODAL_WIDTH}
      >
        <ModalContent>
          <InfoMessage>
            {localize(Localization.EXTRACTOR_SAVE_INFO_MESSAGE)}
          </InfoMessage>
        </ModalContent>
      </Modal>
      {
        isLoading && (
          <ProgressModal
            current={DEFAULT_CURRENT}
            title={localize(Localization.FIELDS_RE_EXTRACTION)}
            total={DEFAULT_TOTAL}
          />
        )
      }
    </>
  )
}

SaveExtractorModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCreateNew: PropTypes.func.isRequired,
  onEditExisting: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
