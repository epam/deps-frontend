
import { LeftIcon } from '@/components/Icons/LeftIcon'
import { RightIcon } from '@/components/Icons/RightIcon'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import {
  confirmHandler,
  getActiveFieldIndex,
  getTooltipConfig,
} from '@/containers/PromptCalibrationStudio/utils'
import { Field } from '@/containers/PromptCalibrationStudio/viewModels'
import { Localization, localize } from '@/localization/i18n'
import { IconButton, SwitcherWrapper } from './FieldsSwitcher.styles'

export const FieldsSwitcher = () => {
  const {
    activeField,
    setActiveField,
    fields,
  } = useFieldCalibration()

  const currentIndex = getActiveFieldIndex(fields, activeField)

  const switchToField = (field) => {
    const showConfirm = !!activeField?.query && Field.isQueryMutated(activeField)
    confirmHandler(
      () => setActiveField(field),
      showConfirm,
      localize(Localization.DISCARD_CHANGES_BEFORE_SWITCH_MODE),
    )
  }

  const onPrevious = () => {
    if (currentIndex === 0) {
      return switchToField(fields[fields.length - 1])
    }

    switchToField(fields[currentIndex - 1])
  }

  const onNext = () => {
    if (currentIndex === fields.length - 1) {
      return switchToField(fields[0])
    }

    switchToField(fields[currentIndex + 1])
  }

  const isNavigationDisabled = fields.length === 1 || (!!activeField?.query && Field.isQueryMutated(activeField))

  return (
    <SwitcherWrapper>
      <IconButton
        disabled={isNavigationDisabled}
        icon={<LeftIcon />}
        onClick={onPrevious}
        tooltip={getTooltipConfig(localize(Localization.PREVIOUS_FIELD))}
      />
      <IconButton
        disabled={isNavigationDisabled}
        icon={<RightIcon />}
        onClick={onNext}
        tooltip={getTooltipConfig(localize(Localization.NEXT_FIELD))}
      />
    </SwitcherWrapper>
  )
}
