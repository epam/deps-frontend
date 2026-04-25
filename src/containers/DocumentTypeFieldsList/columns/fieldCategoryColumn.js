
import { RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY } from '@/enums/DocumentTypeFieldCategory'
import { Localization, localize } from '@/localization/i18n'
import { stringsSorter } from '@/utils/string'
import { FieldColumn } from '../FieldColumn'

const generateFieldCategoryColumn = () => ({
  title: localize(Localization.CATEGORY),
  dataIndex: FieldColumn.CATEGORY,
  sorter: (a, b) => stringsSorter(a.category, b.category),
  render: (category) => RESOURCE_DOCUMENT_TYPE_FIELD_CATEGORY[category],
})

export {
  generateFieldCategoryColumn,
}
