
import PropTypes from 'prop-types'
import { Switch } from '@/components/Switch'
import { localize, Localization } from '@/localization/i18n'
import { EnvInlineWrapper, Label } from './BoolSwitch.styles'

export const BoolSwitch = ({ envCode, value, onChange }) => (
  <EnvInlineWrapper>
    <Label text={localize(Localization[envCode])} />
    <Switch
      checked={!!value}
      onChange={(newValue) => onChange(envCode, newValue)}
    />
  </EnvInlineWrapper>
)

BoolSwitch.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}
