
import { FIELD_FORM_CODE } from '@/containers/UploadFilesDrawer/constants'
import { FilesUpload } from '../FilesUpload'
import { StyledFormItem, StyledForm } from './UploadFilesForm.styles'

const filesUploadField = {
  code: FIELD_FORM_CODE.FILES,
  render: FilesUpload,
}

export const UploadFilesForm = () => (
  <StyledForm>
    <StyledFormItem
      field={filesUploadField}
    />
  </StyledForm>
)
