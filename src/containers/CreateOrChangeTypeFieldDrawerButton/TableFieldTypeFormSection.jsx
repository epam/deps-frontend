
import { useMemo } from 'react'
import { FormItem } from '@/components/Form/ReactHookForm'
import { CustomSelect, SelectMode } from '@/components/Select'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeFieldShape } from '@/models/DocumentTypeField'

const FIELDS_CODE = {
  columns: 'columns',
}

const TableFieldTypeFormSection = ({
  field,
}) => {
  const fields = useMemo(() => ([
    {
      code: FIELDS_CODE.columns,
      label: localize(Localization.PREDEFINED_TABLE_HEADERS),
      defaultValue: (field?.fieldMeta?.columns?.map((a) => a.title)) || [],
      render: (props) => (
        <CustomSelect
          mode={SelectMode.TAGS}
          open={false}
          options={[]}
          {...props}
        />
      ),
    },
  ]), [field?.fieldMeta?.columns])

  return (
    fields.map(({ label, ...field }) => (
      <FormItem
        key={field.code}
        field={field}
        label={label}
      />
    ))
  )
}

TableFieldTypeFormSection.propTypes = {
  field: documentTypeFieldShape,
}

export {
  TableFieldTypeFormSection,
}
