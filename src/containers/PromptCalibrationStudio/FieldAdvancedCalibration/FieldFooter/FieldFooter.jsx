
import isEqual from 'lodash/isEqual'
import isNil from 'lodash/isNil'
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Button, ButtonType } from '@/components/Button'
import { CompressIcon } from '@/components/Icons/CompressIcon'
import { Tooltip } from '@/components/Tooltip'
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
  isDisabled,
  onExecute,
}) => {
  const {
    activeField,
    setCalibrationMode,
    updateFieldsAndClose,
    closeCalibrationMode,
  } = useFieldCalibration()

  const onExecuteChain = useCallback(() => {
    onExecute({ nodes: activeField.query.nodes })
  }, [onExecute, activeField?.query?.nodes])

  const executedValue = activeField?.query.value

  const hasExecutedValue = !isNil(executedValue)

  const hasChangesToSave = hasExecutedValue && !isEqual(activeField.value, executedValue)

  const isSaveAvailable = !(
    isDisabled ||
    !hasExecutedValue ||
    !hasChangesToSave ||
    hasInsightsError ||
    !Field.isChainSameAsExecuted(activeField)
  )

  const isExecuteDisabled = isDisabled || Field.isChainSameAsExecuted(activeField)

  const shouldShowConfirm = !!activeField?.query && Field.isQueryMutated(activeField)

  const switchCalibrationMode = () => {
    setCalibrationMode(CALIBRATION_MODE.BASE)
  }

  const onCloseHandler = () => {
    confirmHandler(
      closeCalibrationMode,
      shouldShowConfirm,
      localize(Localization.DISCARD_CHANGES_CONFORM_MESSAGE),
    )
  }

  const onSaveHandler = () => {
    const updatedField = Field.updateFieldValue(activeField)

    updateFieldsAndClose(updatedField)
  }

  const tooltipTitle = (
    activeField?.query.nodes.length > 1
      ? localize(Localization.SWITCH_TO_BASIC_MODE_TOOLTIP)
      : undefined
  )

  const executeChainTooltip = isExecuteDisabled
    ? localize(Localization.EXECUTE_CHAIN_DISABLED_TOOLTIP)
    : undefined

  return (
    <Wrapper>
      <Tooltip title={tooltipTitle}>
        <TextButton
          disabled={isDisabled || activeField?.query.nodes.length > 1}
          onClick={switchCalibrationMode}
        >
          <CompressIcon />
          {localize(Localization.BASIC_MODE)}
        </TextButton>
      </Tooltip>
      <CloseButton
        disabled={isDisabled}
        onClick={onCloseHandler}
      >
        {localize(Localization.CLOSE)}
      </CloseButton>
      {
        isSaveAvailable && (
          <Button
            onClick={onSaveHandler}
            type={ButtonType.PRIMARY}
          >
            {localize(Localization.SAVE)}
          </Button>
        )
      }
      {
        !isSaveAvailable && (
          <Tooltip title={executeChainTooltip}>
            <Button
              disabled={isExecuteDisabled}
              loading={isDisabled}
              onClick={onExecuteChain}
              type={ButtonType.PRIMARY}
            >
              {localize(Localization.EXECUTE_CHAIN)}
            </Button>
          </Tooltip>
        )
      }
    </Wrapper>
  )
}

FieldFooter.propTypes = {
  hasInsightsError: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onExecute: PropTypes.func.isRequired,
}
