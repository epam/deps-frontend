
import PropTypes from 'prop-types'
import { RadioOption } from '@/components/Radio/RadioOption'
import { PrototypeViewType } from '@/enums/PrototypeViewType'
import { Localization, localize } from '@/localization/i18n'
import { ViewSwitcher } from './PrototypeFieldsViewSwitch.styles'

const RadioOptions = [
  new RadioOption({
    value: PrototypeViewType.FIELDS,
    text: localize(Localization.FIELDS_TAB_NAME),

  }),
  new RadioOption({
    value: PrototypeViewType.TABLES,
    text: localize(Localization.TABLES),
  }),
]

const PrototypeFieldsViewSwitch = ({
  fieldsViewType,
  setFieldsViewType,
  className,
}) => (
  <ViewSwitcher
    className={className}
    onChange={setFieldsViewType}
    options={RadioOptions}
    value={fieldsViewType}
  />
)

PrototypeFieldsViewSwitch.propTypes = {
  className: PropTypes.string,
  fieldsViewType: PropTypes.oneOf(
    Object.values(PrototypeViewType),
  ).isRequired,
  setFieldsViewType: PropTypes.func.isRequired,
}

export {
  PrototypeFieldsViewSwitch,
}
