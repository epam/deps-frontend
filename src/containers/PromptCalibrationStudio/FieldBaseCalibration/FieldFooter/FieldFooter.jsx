
import PropTypes from 'prop-types'
import { Button, ButtonType } from '@/components/Button'
import { ExpandIcon } from '@/components/Icons/ExpandIcon'
import { CALIBRATION_MODE } from '@/containers/PromptCalibrationStudio/constants'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { confirmHandler } from '@/containers/PromptCalibrationStudio/utils'
import { Field } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  TextButton,
  CloseButton,
} from './FieldFooter.styles'

export const FieldFooter = ({
  hasInsightsError,
  isExecutedValueChanged,
  isPromptChanged,
  isLoading,
}) => {
  const {
    activeField,
    setCalibrationMode,
    updateFieldsAndClose,
    closeCalibrationMode,
  } = useFieldCalibration()

  const switchCalibrationMode = () => {
    setCalibrationMode(CALIBRATION_MODE.ADVANCED)
  }

  const onCloseHandler = () => {
    const message = (
      isExecutedValueChanged
        ? localize(Localization.DISCARD_CHANGES_CONFORM_MESSAGE)
        : localize(Localization.ADVANCED_MODE_DISABLED_TOOLTIP)
    )

    const condition = isExecutedValueChanged || isPromptChanged

    confirmHandler(closeCalibrationMode, condition, message)
  }

  const onSwitchModeHandler = () => {
    confirmHandler(
      switchCalibrationMode,
      isPromptChanged,
      localize(Localization.ADVANCED_MODE_DISABLED_TOOLTIP),
    )
  }

  const onSaveHandler = () => {
    const updatedField = Field.updateFieldValue(activeField)

    updateFieldsAndClose(updatedField)
  }

  const isSaveDisabled = isLoading || !isExecutedValueChanged || hasInsightsError

  return (
    <Wrapper>
      <TextButton
        disabled={isLoading}
        onClick={onSwitchModeHandler}
      >
        <ExpandIcon />
        {localize(Localization.ADVANCED_MODE)}
      </TextButton>
      <CloseButton
        disabled={isLoading}
        onClick={onCloseHandler}
      >
        {localize(Localization.CLOSE)}
      </CloseButton>
      <Button
        disabled={isSaveDisabled}
        onClick={onSaveHandler}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </Wrapper>
  )
}

FieldFooter.propTypes = {
  hasInsightsError: PropTypes.bool.isRequired,
  isExecutedValueChanged: PropTypes.bool.isRequired,
  isPromptChanged: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
}
