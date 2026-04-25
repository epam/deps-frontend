
import PropTypes from 'prop-types'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Form, FormItem } from '@/components/Form'
import { CustomSelect } from '@/components/Select'
import { DocumentTypesGroupsSelect } from '@/containers/DocumentTypesGroupsSelect'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType, documentTypeShape } from '@/models/DocumentType'
import { documentTypesGroupShape } from '@/models/DocumentTypesGroup'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'

const FieldCode = {
  DOCUMENT_TYPES_GROUP: 'documentTypesGroup',
  DOCUMENT_TYPE: 'documentType',
}

const DocumentTypeSelection = ({
  selectedGroup,
  selectedDocumentType,
  documentTypes,
  onDocumentTypeChange,
  onGroupChange,
}) => {
  const areDocumentTypesFetching = useSelector(areTypesFetchingSelector)

  const methods = useForm()

  const typesToDisplay = selectedGroup
    ? documentTypes?.filter(({ code }) => selectedGroup.documentTypeIds.includes(code))
    : documentTypes

  const documentTypesOptions = typesToDisplay.map(DocumentType.toOption)

  const handleGroupChange = (group) => {
    onGroupChange(group)
    onDocumentTypeChange(null)
  }

  const handleDocumentTypeChange = (documentTypeCode) => {
    const documentType = documentTypes?.find(({ code }) => code === documentTypeCode)
    onDocumentTypeChange(documentType)
  }

  const fields = [
    ...(ENV.FEATURE_DOCUMENT_TYPES_GROUPS ? [{
      code: FieldCode.DOCUMENT_TYPES_GROUP,
      label: localize(Localization.DOCUMENT_TYPES_GROUP),
      render: (props) => (
        <DocumentTypesGroupsSelect
          {...props}
          onChange={handleGroupChange}
        />
      ),
    }] : []),
    {
      code: FieldCode.DOCUMENT_TYPE,
      label: localize(Localization.DOCUMENT_TYPE),
      value: selectedDocumentType?.code,
      onChange: handleDocumentTypeChange,
      render: (props) => (
        <CustomSelect
          allowClear
          allowSearch
          fetching={areDocumentTypesFetching}
          options={documentTypesOptions}
          placeholder={localize(Localization.SELECT_DOCUMENT_TYPE)}
          {...props}
        />
      ),
    },
  ]

  return (
    <FormProvider {...methods}>
      <Form>
        {
          fields.map(({ label, ...field }) => (
            <FormItem
              key={field.code}
              field={field}
              label={label}
            />
          ))
        }
      </Form>
    </FormProvider>
  )
}

DocumentTypeSelection.propTypes = {
  selectedGroup: documentTypesGroupShape,
  selectedDocumentType: documentTypeShape,
  documentTypes: PropTypes.arrayOf(
    documentTypeShape,
  ).isRequired,
  onGroupChange: PropTypes.func.isRequired,
  onDocumentTypeChange: PropTypes.func.isRequired,
}

export {
  DocumentTypeSelection,
}
