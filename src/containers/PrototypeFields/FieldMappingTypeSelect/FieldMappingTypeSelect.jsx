
import PropTypes from 'prop-types'
import { MappingType } from '@/enums/MappingType'
import { FIELD_MAPPING_TYPE_TO_LABEL_MAPPER } from '../mappers'
import { Wrapper, Select } from './FieldMappingTypeSelect.styles'

const { Option } = Select

const FieldMappingTypeSelect = ({
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
        Object.entries(FIELD_MAPPING_TYPE_TO_LABEL_MAPPER).map(([key, value]) => (
          <Option
            key={key}
            value={key}
          >
            <span>{value}</span>
          </Option>
        ))
      }
    </Select>
  </Wrapper>
)

FieldMappingTypeSelect.propTypes = {
  disabled: PropTypes.bool.isRequired,
  value: PropTypes.oneOf(
    Object.values(MappingType),
  ).isRequired,
  setValue: PropTypes.func.isRequired,
}

export {
  FieldMappingTypeSelect,
}
