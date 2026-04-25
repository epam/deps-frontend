
import { useState, useMemo, useCallback } from 'react'
import { ButtonType } from '@/components/Button'
import { List } from '@/components/List'
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import {
  Modal,
  ListItem,
  NewPlusIcon,
  TriggerButton,
} from './AddDocumentTypeFieldModalButton.styles'
import { AddExtraFieldSection } from './AddExtraFieldSection'
import { AddGenAiDrivenFieldSection } from './AddGenAiDrivenFieldSection'

const FIELD_CATEGORY_TO_RENDER = {
  [DocumentTypeFieldCategory.GEN_AI]: {
    component: AddGenAiDrivenFieldSection,
    hidden: !ENV.FEATURE_LLM_EXTRACTORS,
  },
  [DocumentTypeFieldCategory.EXTRA]: {
    component: AddExtraFieldSection,
    hidden: !ENV.FEATURE_ENRICHMENT,
  },
}

const MODAL_WIDTH = 320

const AddDocumentTypeFieldModalButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = () => {
    setIsModalVisible(true)
  }

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  const ModalContent = useMemo(() => (
    <List>
      {
        Object.values(DocumentTypeFieldCategory)
          .filter((category) => FIELD_CATEGORY_TO_RENDER[category] &&
            !FIELD_CATEGORY_TO_RENDER[category].hidden)
          .map((category) => {
            const { component: AddFieldComponent } = FIELD_CATEGORY_TO_RENDER[category]
            return (
              <ListItem
                key={category}
                onClick={closeModal}
              >
                <AddFieldComponent />
              </ListItem>
            )
          })
      }
    </List>
  ), [closeModal])

  return (
    <>
      <TriggerButton
        $focused={isModalVisible}
        onClick={openModal}
        type={ButtonType.PRIMARY}
      >
        <NewPlusIcon />
        {localize(Localization.ADD_FIELD)}
      </TriggerButton>
      <Modal
        footer={null}
        onCancel={closeModal}
        open={isModalVisible}
        title={localize(Localization.SELECT_FIELD_CATEGORY)}
        width={MODAL_WIDTH}
      >
        {ModalContent}
      </Modal>
    </>
  )
}

export {
  AddDocumentTypeFieldModalButton,
}
