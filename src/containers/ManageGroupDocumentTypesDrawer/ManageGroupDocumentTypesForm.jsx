
import PropTypes from 'prop-types'
import {
  Form,
  FormItem,
  RequiredValidator,
} from '@/components/Form/ReactHookForm'
import { CustomSelect, SelectMode } from '@/components/Select'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType, documentTypeShape } from '@/models/DocumentType'

const GROUP_PROPERTY = {
  DOCUMENT_TYPE_IDS: 'documentTypeIds',
}

const MAX_TAGS_COUNT = 10

const renderTagsTooltip = (omittedValues) => {
  const combinedTitle = omittedValues.map(({ label }) => label).join(', ')

  return (
    <Tooltip
      title={combinedTitle}
    >
      {`+ ${omittedValues.length}`}
    </Tooltip>
  )
}

const ManageGroupDocumentTypesForm = ({ documentTypes }) => {
  const documentTypesOptions = documentTypes.map(DocumentType.toOption)

  const fields = [
    {
      code: GROUP_PROPERTY.DOCUMENT_TYPE_IDS,
      requiredMark: true,
      label: localize(Localization.DOCUMENT_TYPES),
      placeholder: localize(Localization.DOC_TYPES_PLACEHOLDER),
      rules: {
        ...new RequiredValidator(),
      },
      render: (props) => (
        <CustomSelect
          {...props}
          maxTagCount={MAX_TAGS_COUNT}
          maxTagPlaceholder={renderTagsTooltip}
          mode={SelectMode.MULTIPLE}
          options={documentTypesOptions}
          showArrow
        />
      ),
    },
  ]

  return (
    <Form>
      {
        fields.map(({ label, requiredMark, ...field }) => (
          <FormItem
            key={field.code}
            field={field}
            label={label}
            requiredMark={requiredMark}
          />
        ))
      }
    </Form>
  )
}

ManageGroupDocumentTypesForm.propTypes = {
  documentTypes: PropTypes.arrayOf(
    documentTypeShape,
  ),
}

export {
  ManageGroupDocumentTypesForm,
}
