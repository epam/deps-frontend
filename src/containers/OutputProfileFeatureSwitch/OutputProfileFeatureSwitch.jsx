
import PropTypes from 'prop-types'
import { Switch } from '@/components/Switch'
import { ComponentSize } from '@/enums/ComponentSize'
import { FeatureLabel, FeatureSwitcher } from './OutputProfileFeatureSwitch.styles'

const OutputProfileFeatureSwitch = ({
  code,
  name,
  checked,
  onChange,
  disabled,
}) => {
  const handleChange = (checked) => {
    onChange(checked, code)
  }

  return (
    <FeatureSwitcher
      key={code}
      data-testid={`switcher-${code}`}
    >
      <FeatureLabel>
        {name}
      </FeatureLabel>
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        size={ComponentSize.SMALL}
      />
    </FeatureSwitcher>
  )
}

OutputProfileFeatureSwitch.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export {
  OutputProfileFeatureSwitch,
}
