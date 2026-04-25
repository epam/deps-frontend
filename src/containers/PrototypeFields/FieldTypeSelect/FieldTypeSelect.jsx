
import PropTypes from 'prop-types'
import { FieldType } from '@/enums/FieldType'
import {
  FIELD_TYPE_TO_ICON_MAPPER,
  FIELD_TYPE_TO_LABEL_MAPPER,
} from '../mappers'
import { Wrapper, Select } from './FieldTypeSelect.styles'

const { Option } = Select

const FieldTypeSelect = ({
  disabled,
  value,
  setValue,
}) => (
  <Wrapper>
    <Select
      defaultValue={value}
      disabled={disabled}
      getPopupContainer={(trigger) => trigger.parentNode}
      onChange={setValue}
    >
      {
        Object.entries(FIELD_TYPE_TO_LABEL_MAPPER).map(([key, value]) => (
          <Option
            key={key}
            value={key}
          >
            {FIELD_TYPE_TO_ICON_MAPPER[key]()}
            <span>{value}</span>
          </Option>
        ))
      }
    </Select>
  </Wrapper>
)

FieldTypeSelect.propTypes = {
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
  setValue: PropTypes.func.isRequired,
}

export {
  FieldTypeSelect,
}
