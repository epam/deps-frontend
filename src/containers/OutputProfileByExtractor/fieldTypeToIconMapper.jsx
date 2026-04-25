
import { CheckboxFieldIcon } from '@/components/Icons/CheckboxFieldIcon'
import { DateFieldIcon } from '@/components/Icons/DateFieldIcon'
import { EnumFieldIcon } from '@/components/Icons/EnumField'
import { KeyValuePairFieldIcon } from '@/components/Icons/KeyValuePairFieldIcon'
import { StringFieldIcon } from '@/components/Icons/StringFieldIcon'
import { TableFieldIcon } from '@/components/Icons/TableFieldIcon'
import { FieldType } from '@/enums/FieldType'

const FIELD_TYPE_TO_ICON_MAPPER = {
  [FieldType.CHECKMARK]: () => <CheckboxFieldIcon />,
  [FieldType.STRING]: () => <StringFieldIcon />,
  [FieldType.DICTIONARY]: () => <KeyValuePairFieldIcon />,
  [FieldType.TABLE]: () => <TableFieldIcon />,
  [FieldType.ENUM]: () => <EnumFieldIcon />,
  [FieldType.DATE]: () => <DateFieldIcon />,
}

export {
  FIELD_TYPE_TO_ICON_MAPPER,
}
