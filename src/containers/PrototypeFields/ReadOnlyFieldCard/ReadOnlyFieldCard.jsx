
import { ALLOWED_FIELD_TYPES_FOR_DISPLAY_MODE_FEATURE } from '@/constants/field'
import { ManageFieldDisplayModeButton } from '@/containers/ManageFieldDisplayModeButton'
import { prototypeFieldShape } from '@/models/PrototypeField'
import { ENV } from '@/utils/env'
import {
  FIELD_MAPPING_TYPE_TO_LABEL_MAPPER,
  FIELD_TYPE_TO_ICON_MAPPER,
} from '../mappers'
import { MappingKeys } from '../MappingKeys'
import {
  Wrapper,
  Header,
  FieldName,
  KeysWrapper,
  TypeWrapper,
  Separator,
} from './ReadOnlyFieldCard.styles'

const ReadOnlyFieldCard = ({ field }) => {
  const { name, mapping } = field

  const isManageDisplayModeAllowed = (
    ENV.FEATURE_FIELDS_DISPLAY_MODE &&
    ALLOWED_FIELD_TYPES_FOR_DISPLAY_MODE_FEATURE.includes(field.fieldType.typeCode)
  )

  return (
    <Wrapper>
      <Header>
        <FieldName>{name}</FieldName>
        <TypeWrapper>
          {FIELD_MAPPING_TYPE_TO_LABEL_MAPPER[field.mapping.mappingType]}
        </TypeWrapper>
        <Separator />
        <TypeWrapper>
          {FIELD_TYPE_TO_ICON_MAPPER[field.fieldType.typeCode]()}
        </TypeWrapper>
        {
          isManageDisplayModeAllowed && (
            <>
              <Separator />
              <ManageFieldDisplayModeButton field={field} />
            </>
          )
        }
      </Header>
      <KeysWrapper>
        <MappingKeys keys={mapping.keys} />
      </KeysWrapper>
    </Wrapper>
  )
}

ReadOnlyFieldCard.propTypes = {
  field: prototypeFieldShape.isRequired,
}

export {
  ReadOnlyFieldCard,
}
