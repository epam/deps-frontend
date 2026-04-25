
import PropTypes from 'prop-types'
import { RadioButtonStyle, RadioOptionType } from '@/components/Radio'
import { RadioOption } from '@/components/Radio/RadioOption'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { TableHeaderType } from '@/models/PrototypeTableField'
import {
  ColumnsIcon,
  RowsIcon,
  ViewSwitcher,
} from './TableHeaderSwitch.styles'

const RadioOptions = [
  new RadioOption({
    value: TableHeaderType.COLUMNS,
    icon: <ColumnsIcon />,
    tooltip: {
      title: localize(Localization.COLUMNS_HEADER_TYPE_HINT),
      placement: Placement.TOP_RIGHT,
    },
  }),
  new RadioOption({
    value: TableHeaderType.ROWS,
    icon: <RowsIcon />,
    tooltip: {
      title: localize(Localization.ROWS_HEADER_TYPE_HINT),
      placement: Placement.TOP_RIGHT,
    },
  }),
]

const TableHeaderSwitch = ({
  onChange,
  value,
}) => (
  <ViewSwitcher
    buttonStyle={RadioButtonStyle.SOLID}
    onChange={onChange}
    optionType={RadioOptionType.BUTTON}
    options={RadioOptions}
    value={value}
  />
)

TableHeaderSwitch.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOf(
    Object.values(TableHeaderType),
  ),
}

export {
  TableHeaderSwitch,
}
