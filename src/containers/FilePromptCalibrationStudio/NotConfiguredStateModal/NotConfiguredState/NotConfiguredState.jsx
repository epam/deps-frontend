
import { localize, Localization } from '@/localization/i18n'
import {
  NotConfiguredContainer,
  NotConfiguredText,
  WarningIcon,
} from './NotConfiguredState.styles'

export const NotConfiguredState = () => (
  <NotConfiguredContainer>
    <WarningIcon />
    <NotConfiguredText>
      {localize(Localization.PROMPT_CALIBRATION_STUDIO_NOT_CONFIGURED)}
    </NotConfiguredText>
  </NotConfiguredContainer>
)
