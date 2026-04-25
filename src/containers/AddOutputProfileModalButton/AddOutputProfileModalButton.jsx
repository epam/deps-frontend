
import PropTypes from 'prop-types'
import { useState, useMemo, useCallback } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { List } from '@/components/List'
import { Localization, localize } from '@/localization/i18n'
import { AddOutputProfileByExtractorSection } from './AddOutputProfileByExtractorSection'
import { AddOutputProfileByLayoutSection } from './AddOutputProfileByLayoutSection'
import {
  ListItem,
  Modal,
  PlusIcon,
} from './AddOutputProfileModalButton.styles'

const MODAL_WIDTH = 320

const AddOutputProfileModalButton = ({ disabled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const ModalContent = useMemo(() => (
    <List>
      <ListItem onClick={closeModal}>
        <AddOutputProfileByExtractorSection />
      </ListItem>
      <ListItem onClick={closeModal}>
        <AddOutputProfileByLayoutSection />
      </ListItem>
    </List>
  ), [closeModal])

  return (
    <>
      <Button
        disabled={disabled}
        onClick={openModal}
        type={ButtonType.PRIMARY}
      >
        <PlusIcon />
        {localize(Localization.ADD_OUTPUT_PROFILE)}
      </Button>
      <Modal
        footer={null}
        mask={false}
        onCancel={closeModal}
        open={isModalVisible}
        title={localize(Localization.SELECT_PROFILE_TYPE)}
        width={MODAL_WIDTH}
      >
        {ModalContent}
      </Modal>
    </>
  )
}

AddOutputProfileModalButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
}

export {
  AddOutputProfileModalButton,
}
