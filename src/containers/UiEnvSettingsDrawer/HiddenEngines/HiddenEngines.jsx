
import PropTypes from 'prop-types'
import {
  CustomSelect,
  SelectMode,
  SelectOption,
} from '@/components/Select'
import { localize, Localization } from '@/localization/i18n'
import { Engine } from '@/models/Engine'
import { ENV } from '@/utils/env'
import { Label, EnvWrapper } from '../EnvLayout.styles'

const OptionsToSelect = (
  (ENV.FEATURE_HIDDEN_ENGINES || [])
    .map((value) => new SelectOption(value, value))
    .concat(Engine.toAllEngines().map(Engine.toOption))
    .filter((o, i, options) => options.findIndex((opt) => opt.value === o.value) === i)
)

export const HiddenEngines = ({ value, envCode, onChange }) => (
  <EnvWrapper>
    <Label>
      {localize(Localization.HIDDEN_ENGINES)}
    </Label>
    <CustomSelect
      allowSearch={false}
      mode={SelectMode.TAGS}
      onChange={(selectedValues) => onChange(envCode, selectedValues)}
      options={OptionsToSelect}
      showArrow
      value={value}
    />
  </EnvWrapper>
)

HiddenEngines.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ),
  onChange: PropTypes.func.isRequired,
}
