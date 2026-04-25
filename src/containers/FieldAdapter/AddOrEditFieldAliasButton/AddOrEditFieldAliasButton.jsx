
import PropTypes from 'prop-types'
import {
  useCallback,
  useState,
} from 'react'
import { TextEditorModal } from '@/components/TextEditorModal'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { Localization, localize } from '@/localization/i18n'
import { extractedDataFieldShape } from '@/models/ExtractedData'

const MODAL_HEIGHT = 64

const getModalStyle = (container) => {
  const subFieldContainer = container.firstChild.lastChild
  const { left, top } = subFieldContainer.getBoundingClientRect()

  return {
    left,
    top: top - MODAL_HEIGHT,
  }
}

const AddOrEditFieldAliasButton = ({
  alias,
  containerId,
  disabled,
  field,
  isSaving,
  onSave,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const closeModal = useCallback(() => {
    setIsVisible(false)
  }, [])

  const openModal = () => {
    setIsVisible(true)
  }

  const onSubmit = useCallback(async (newAlias) => {
    await onSave(field, newAlias)
    closeModal()
  }, [
    field,
    onSave,
    closeModal,
  ])

  const container = document.getElementById(containerId).firstChild

  return (
    <>
      <ActionsMenu.ItemButton
        disabled={disabled}
        onClick={openModal}
      >
        {
          alias
            ? localize(Localization.EDIT_FIELD_NAME)
            : localize(Localization.SET_FIELD_NAME)
        }
      </ActionsMenu.ItemButton>
      {
        isVisible && (
          <TextEditorModal
            getContainer={() => container}
            isLoading={isSaving}
            onCancel={closeModal}
            onSubmit={onSubmit}
            placeholder={localize(Localization.SET_FIELD_NAME_PLACEHOLDER)}
            style={getModalStyle(container)}
            value={alias}
          />
        )
      }
    </>
  )
}

AddOrEditFieldAliasButton.propTypes = {
  alias: PropTypes.string,
  containerId: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  field: extractedDataFieldShape.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
}

export {
  AddOrEditFieldAliasButton,
}
