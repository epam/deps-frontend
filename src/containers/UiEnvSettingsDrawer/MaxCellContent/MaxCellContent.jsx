import PropTypes from 'prop-types'
import { localize, Localization } from '@/localization/i18n'
import { Label, EnvWrapper } from '../EnvLayout.styles'
import { InputNumber } from './MaxCellContent.styles'

export const MaxCellContent = ({ value, envCode, onChange }) => (
  <EnvWrapper>
    <Label>{localize(Localization.MAX_CELL_CONTENT_LENGTH)}</Label>
    <InputNumber
      min={0}
      onChange={(newValue) => onChange(envCode, newValue)}
      value={value}
    />
  </EnvWrapper>
)

MaxCellContent.propTypes = {
  envCode: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
