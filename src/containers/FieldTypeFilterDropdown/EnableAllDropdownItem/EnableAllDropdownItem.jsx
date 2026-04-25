
import PropTypes from 'prop-types'
import { Switch } from '@/components/Switch'
import { ComponentSize } from '@/enums/ComponentSize'
import { Localization, localize } from '@/localization/i18n'
import { EnableAllText } from './EnableAllDropdownItem.styles'

const EnableAllDropdownItem = ({
  checked,
  indeterminate,
  onChange,
}) => (
  <>
    <EnableAllText>
      {localize(Localization.ENABLE_ALL)}
    </EnableAllText>
    <Switch
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      size={ComponentSize.SMALL}
    />
  </>
)

EnableAllDropdownItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  indeterminate: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

export {
  EnableAllDropdownItem,
}
