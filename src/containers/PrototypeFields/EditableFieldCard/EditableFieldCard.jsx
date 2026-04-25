
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { clearKeyToAssign } from '@/actions/prototypePage'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { ALLOWED_FIELD_TYPES_FOR_DISPLAY_MODE_FEATURE } from '@/constants/field'
import { ManageFieldDisplayModeButton } from '@/containers/ManageFieldDisplayModeButton'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { Localization, localize } from '@/localization/i18n'
import {
  DateFieldDescription,
  EnumFieldDescription,
  ListFieldDescription,
  prototypeFieldShape,
} from '@/models/PrototypeField'
import { keyToAssignSelector } from '@/selectors/prototypePage'
import { ENV } from '@/utils/env'
import { FieldMappingTypeSelect } from '../FieldMappingTypeSelect'
import { FieldTypeSelect } from '../FieldTypeSelect'
import { MappingKeys } from '../MappingKeys'
import {
  Wrapper,
  Header,
  NameInput,
  KeysWrapper,
  DeleteIconButton,
  Separator,
} from './EditableFieldCard.styles'

const MAX_INPUT_LENGTH = 50

const MAP_FIELD_TYPE_TO_DESCRIPTION = {
  [FieldType.DATE]: new DateFieldDescription(),
  [FieldType.ENUM]: new EnumFieldDescription(),
}

const getFieldDescription = (typeCode, mappingType, meta) => {
  const description = {
    ...(MAP_FIELD_TYPE_TO_DESCRIPTION[typeCode] || {}),
    ...meta,
  }

  if (mappingType === MappingType.ONE_TO_MANY) {
    return new ListFieldDescription(typeCode, description)
  }

  return description
}

const EditableFieldCard = ({
  field,
  isSaved,
  removeField,
  updatePrototypeField,
}) => {
  const dispatch = useDispatch()
  const keyToAssign = useSelector(keyToAssignSelector)

  const { name, mapping, fieldType } = field

  const updateFieldType = (typeCode) => {
    updatePrototypeField({
      ...field,
      fieldType: {
        ...fieldType,
        typeCode,
        description: getFieldDescription(typeCode, mapping.mappingType),
      },
    })
  }

  const updateMappingType = (mappingType) => {
    updatePrototypeField({
      ...field,
      fieldType: {
        ...fieldType,
        description: getFieldDescription(fieldType.typeCode, mappingType),
      },
      mapping: {
        ...mapping,
        mappingType,
      },
    })
  }

  const updateMappingKeys = (keys) => {
    updatePrototypeField({
      ...field,
      mapping: {
        ...mapping,
        keys,
      },
    })
  }

  const updateDisplayMode = ({
    readOnly,
    confidential,
    displayCharLimit,
  }) => {
    const description = getFieldDescription(
      fieldType.typeCode,
      mapping.mappingType,
      { displayCharLimit },
    )

    updatePrototypeField({
      ...field,
      readOnly,
      confidential,
      fieldType: {
        ...fieldType,
        description,
      },
    })
  }

  const onNameChange = (e) => {
    const name = e.target.value
    updatePrototypeField({
      ...field,
      name,
    })
  }

  const onWrapperClick = () => {
    if (!keyToAssign) {
      return
    }

    updateMappingKeys([keyToAssign, ...mapping.keys])

    dispatch(clearKeyToAssign())
  }

  const isManageDisplayModeAllowed = (
    ENV.FEATURE_FIELDS_DISPLAY_MODE &&
    ALLOWED_FIELD_TYPES_FOR_DISPLAY_MODE_FEATURE.includes(field.fieldType.typeCode)
  )

  return (
    <Wrapper
      $isActive={!!keyToAssign}
      onClick={onWrapperClick}
    >
      <Header>
        <NameInput
          maxLength={MAX_INPUT_LENGTH}
          onChange={onNameChange}
          placeholder={localize(Localization.ENTER_FIELD_NAME)}
          value={name}
        />
        <FieldMappingTypeSelect
          disabled={isSaved}
          setValue={updateMappingType}
          value={field.mapping.mappingType}
        />
        <Separator />
        <FieldTypeSelect
          disabled={isSaved}
          setValue={updateFieldType}
          value={field.fieldType.typeCode}
        />
        {
          isManageDisplayModeAllowed && (
            <>
              <Separator />
              <ManageFieldDisplayModeButton
                field={field}
                updateDisplayMode={updateDisplayMode}
              />
            </>
          )
        }
        <DeleteIconButton
          icon={<XMarkIcon />}
          onClick={() => removeField(field.id)}
        />
      </Header>
      <KeysWrapper>
        <MappingKeys
          isEditMode
          keys={mapping.keys}
          updateMappingKeys={updateMappingKeys}
        />
      </KeysWrapper>
    </Wrapper>
  )
}

EditableFieldCard.propTypes = {
  field: prototypeFieldShape.isRequired,
  isSaved: PropTypes.bool.isRequired,
  removeField: PropTypes.func.isRequired,
  updatePrototypeField: PropTypes.func.isRequired,
}

export {
  EditableFieldCard,
}
