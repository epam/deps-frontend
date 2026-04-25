
import PropTypes from 'prop-types'
import { Button, ButtonType } from '@/components/Button'
import { ConfidenceLevelView as ConfidenceLevelViewEnum } from '@/enums/ConfidenceLevel'
import { Localization, localize } from '@/localization/i18n'
import { BtnGroup, Label, EnvWrapper } from '../EnvLayout.styles'

export const ConfidenceLevelView = ({ value, envCode, onChange }) => (
  <EnvWrapper>
    <Label>{localize(Localization.CONFIDENCE_LEVEL_VIEW)}</Label>
    <BtnGroup>
      <Button
        data-testid={ConfidenceLevelViewEnum.AS_ICONS}
        onClick={() => onChange(envCode, ConfidenceLevelViewEnum.AS_ICONS)}
        type={value === ConfidenceLevelViewEnum.AS_ICONS ? ButtonType.PRIMARY : ButtonType.DEFAULT}
      >
        {localize(Localization.ICONS)}
      </Button>
      <Button
        data-testid={ConfidenceLevelViewEnum.AS_NUMBERS}
        onClick={() => onChange(envCode, ConfidenceLevelViewEnum.AS_NUMBERS)}
        type={value === ConfidenceLevelViewEnum.AS_NUMBERS ? ButtonType.PRIMARY : ButtonType.DEFAULT}
      >
        {localize(Localization.NUMBERS)}
      </Button>
    </BtnGroup>
  </EnvWrapper>
)

ConfidenceLevelView.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.oneOf(
    Object.values(ConfidenceLevelViewEnum),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
}
