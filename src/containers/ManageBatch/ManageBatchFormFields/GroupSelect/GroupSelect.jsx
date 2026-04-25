
import PropTypes from 'prop-types'
import { useFormContext, useWatch } from 'react-hook-form'
import { DocumentTypesGroupsSelect } from '@/containers/DocumentTypesGroupsSelect'
import { FIELD_FORM_CODE } from '@/containers/ManageBatch/constants'

export const GroupSelect = ({ onChange, ...props }) => {
  const { resetField } = useFormContext()

  const docType = useWatch({ name: FIELD_FORM_CODE.DOCUMENT_TYPE })
  const files = useWatch({ name: FIELD_FORM_CODE.FILES })

  const handleGroupChange = (group) => {
    onChange(group)

    if (!group?.documentTypeIds.includes(docType)) {
      resetField(FIELD_FORM_CODE.DOCUMENT_TYPE)
    }

    files?.forEach((fileData, index) => {
      if (!group?.documentTypeIds.includes(fileData.settings.documentType)) {
        resetField(`${FIELD_FORM_CODE.FILES}.${index}.settings.documentType`)
      }
    })
  }

  return (
    <DocumentTypesGroupsSelect
      onChange={handleGroupChange}
      {...props}
    />
  )
}

GroupSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
}
