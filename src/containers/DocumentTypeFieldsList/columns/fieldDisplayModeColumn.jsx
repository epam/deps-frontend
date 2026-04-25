
import { DocumentTypeFieldCategory } from '@/enums/DocumentTypeFieldCategory'
import { Localization, localize } from '@/localization/i18n'
import { DisplayModeCell } from '../DisplayModeCell'
import { FieldColumn } from '../FieldColumn'

const sortDisplayMode = (a, b) => (
  b.confidential - a.confidential ||
  b.readOnly - a.readOnly
)

const generateFieldDisplayModeColumn = () => ({
  title: localize(Localization.DISPLAY_MODE),
  dataIndex: FieldColumn.DISPLAY_MODE,
  render: (_, { category, ...field }) => (
    category !== DocumentTypeFieldCategory.EXTRA && (
      <DisplayModeCell field={field} />
    )
  ),
  sorter: sortDisplayMode,
})

export {
  generateFieldDisplayModeColumn,
}
