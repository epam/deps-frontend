
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { FieldColumn } from '../FieldColumn'
import { FieldTypeCell } from '../FieldTypeCell'

const getFieldType = (field) => (
  field.type || field.fieldType
)

const generateFieldTypeColumn = () => ({
  title: localize(Localization.FIELD_TYPE),
  dataIndex: FieldColumn.TYPE,
  render: (_, field) => (
    <FieldTypeCell
      fieldMeta={field.fieldMeta}
      fieldType={getFieldType(field)}
    />
  ),
  sorter: (a, b) => stringsSorter(
    getFieldType(a),
    getFieldType(b),
  ),
})

export {
  generateFieldTypeColumn,
}
