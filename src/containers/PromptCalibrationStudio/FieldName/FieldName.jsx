
import { useRef, useState } from 'react'
import { PenIcon } from '@/components/Icons/PenIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { LongText } from '@/components/LongText'
import { Modal } from '@/components/Modal'
import { TextEditorModal } from '@/components/TextEditorModal'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { getTooltipConfig } from '@/containers/PromptCalibrationStudio/utils'
import { Field as FieldModel } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  FieldTitle,
  ActionsWrapper,
  Hint,
  Divider,
  StyledIconButton,
} from './FieldName.styles'

const getModalStyle = (container) => {
  const { left, bottom } = container.getBoundingClientRect()

  return {
    left,
    top: bottom,
  }
}

export const FieldName = () => {
  const {
    activeField,
    setActiveField,
    fields,
    updateFields,
    deleteField,
  } = useFieldCalibration()
  const [isEditingName, setIsEditingName] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const fieldTitleRef = useRef(null)

  const openNameModal = () => {
    setIsEditingName(true)
    setValidationError(null)
  }

  const closeNameModal = () => {
    setIsEditingName(false)
    setValidationError(null)
  }

  const submitFieldName = (name) => {
    const trimmedName = name.trim()

    if (trimmedName === activeField.name) {
      closeNameModal()
      return
    }

    const isDuplicated = fields.some(
      (f) => f.id !== activeField.id && f.name.toLowerCase() === trimmedName.toLowerCase(),
    )

    if (isDuplicated) {
      setValidationError(localize(Localization.FIELD_NAME_DUPLICATE))
      return
    }

    const updatedField = FieldModel.updateName(activeField, trimmedName)

    setActiveField(updatedField)

    updateFields(updatedField)

    closeNameModal()
  }

  const confirmDelete = (e) => {
    e.stopPropagation()

    Modal.confirm({
      cancelText: localize(Localization.CANCEL),
      centered: true,
      okText: localize(Localization.CONFIRM),
      onOk: () => deleteField(activeField.id),
      title: localize(Localization.DELETE_CONFIRM_MESSAGE, { name: activeField.name }),
    })
  }

  return (
    <Wrapper>
      <FieldTitle ref={fieldTitleRef}>
        <LongText text={activeField.name} />
        {
          activeField.isNew && (
            <Hint>
              {localize(Localization.NEW_FIELD)}
            </Hint>
          )
        }
      </FieldTitle>
      <Divider />
      <ActionsWrapper>
        <StyledIconButton
          icon={<PenIcon />}
          onClick={openNameModal}
          tooltip={getTooltipConfig(localize(Localization.EDIT_FIELD_NAME))}
        />
        {
          activeField.isNew && (
            <StyledIconButton
              icon={<TrashIcon />}
              onClick={confirmDelete}
              tooltip={getTooltipConfig(localize(Localization.DELETE_FIELD))}
            />
          )
        }
      </ActionsWrapper>
      {
        isEditingName && (
          <TextEditorModal
            isLoading={false}
            onCancel={closeNameModal}
            onSubmit={submitFieldName}
            placeholder={localize(Localization.ENTER_FIELD_NAME)}
            style={getModalStyle(fieldTitleRef.current)}
            validationError={validationError}
            value={activeField.name}
          />
        )
      }
    </Wrapper>
  )
}
