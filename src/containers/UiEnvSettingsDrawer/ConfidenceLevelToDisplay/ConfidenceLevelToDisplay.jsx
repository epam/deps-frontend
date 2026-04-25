
import PropTypes from 'prop-types'
import {
  CustomSelect,
  SelectMode,
  SelectOption,
} from '@/components/Select'
import { ConfidenceLevel } from '@/enums/ConfidenceLevel'
import { localize, Localization } from '@/localization/i18n'
import { Label, EnvWrapper } from '../EnvLayout.styles'

const OptionsToSelect = Object.entries(ConfidenceLevel).map(([key, value]) => (
  new SelectOption(
    value,
    localize(Localization[key]),
  )
))

export const ConfidenceLevelToDisplay = ({ envCode, value, onChange }) => (
  <EnvWrapper>
    <Label>
      {localize(Localization.CONFIDENCE_LEVEL_TO_DISPLAY)}
    </Label>
    <CustomSelect
      allowSearch={false}
      mode={SelectMode.MULTIPLE}
      onChange={(selectedValues) => onChange(envCode, selectedValues)}
      options={OptionsToSelect}
      showArrow
      value={value}
    />
  </EnvWrapper>
)

ConfidenceLevelToDisplay.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.oneOf(
      Object.values(ConfidenceLevel),
    ).isRequired,
  ),
  onChange: PropTypes.func.isRequired,
}
