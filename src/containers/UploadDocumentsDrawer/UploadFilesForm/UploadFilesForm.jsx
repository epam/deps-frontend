
import { FIELD_FORM_CODE } from '@/containers/UploadDocumentsDrawer/constants'
import { DocumentFilesUpload } from '../DocumentFilesUpload'
import { StyledFormItem, StyledForm } from './UploadFilesForm.styles'

const filesUploadField = {
  code: FIELD_FORM_CODE.FILES,
  render: DocumentFilesUpload,
}

export const UploadFilesForm = () => (
  <StyledForm>
    <StyledFormItem
      field={filesUploadField}
    />
  </StyledForm>
)
