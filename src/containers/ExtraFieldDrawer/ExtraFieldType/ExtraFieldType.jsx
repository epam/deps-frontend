
import PropTypes from 'prop-types'
import { RESOURCE_FIELD_TYPE, FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Input,
  FieldLabel,
} from './ExtraFieldType.styles'

const ExtraFieldType = ({ type }) => (
  <Wrapper>
    <FieldLabel
      name={localize(Localization.TYPE)}
    />
    <Input
      disabled
      value={RESOURCE_FIELD_TYPE[type]}
    />
  </Wrapper>
)

ExtraFieldType.propTypes = {
  type: PropTypes.oneOf(
    Object.values(FieldType),
  ).isRequired,
}

export {
  ExtraFieldType,
}
