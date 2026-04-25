
import PropTypes from 'prop-types'
import {
  CustomSelect,
  SelectMode,
  SelectOption,
} from '@/components/Select'
import { KnownLlmProvider } from '@/enums/KnownLLM'
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { Label, EnvWrapper } from '../EnvLayout.styles'

const OptionsToSelect = (
  (ENV.FEATURE_HIDDEN_LLM_PROVIDERS || [])
    .map((value) => new SelectOption(value, value))
    .concat(Object.values(KnownLlmProvider).map((provider) => new SelectOption(provider, provider)))
    .filter((o, i, options) => options.findIndex((opt) => opt.value === o.value) === i)
)
export const HiddenLlmProviders = ({ value, envCode, onChange }) => (
  <EnvWrapper>
    <Label>
      {localize(Localization.HIDDEN_LLM_PROVIDERS)}
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

HiddenLlmProviders.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ),
  onChange: PropTypes.func.isRequired,
}
