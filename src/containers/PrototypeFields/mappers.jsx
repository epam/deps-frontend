
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { FieldType } from '@/enums/FieldType'
import { MappingType } from '@/enums/MappingType'
import { Localization, localize } from '@/localization/i18n'

export const FIELD_TYPE_TO_LABEL_MAPPER = {
  [FieldType.STRING]: localize(Localization.STRING),
  [FieldType.ENUM]: localize(Localization.ENUM),
  [FieldType.DATE]: localize(Localization.DATE),
  [FieldType.CHECKMARK]: localize(Localization.CHECKMARK),
}

export const FIELD_TYPE_TO_ICON_MAPPER = {
  [FieldType.CHECKMARK]: () => <CheckboxFieldIcon />,
  [FieldType.STRING]: () => <StringFieldIcon />,
  [FieldType.ENUM]: () => <EnumFieldIcon />,
  [FieldType.DATE]: () => <DateFieldIcon />,
}

export const FIELD_MAPPING_TYPE_TO_LABEL_MAPPER = {
  [MappingType.ONE_TO_ONE]: localize(Localization.ONE_TO_ONE),
  [MappingType.ONE_TO_MANY]: localize(Localization.ONE_TO_MANY),
}
