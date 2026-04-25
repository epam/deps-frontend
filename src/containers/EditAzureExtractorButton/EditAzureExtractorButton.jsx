
import { ButtonType } from '@/components/Button'
import { EditAzureExtractorDrawer } from '@/containers/EditAzureExtractorDrawer'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { EditButton } from './EditAzureExtractorButton.styles'

const EditAzureExtractorButton = ({ documentType }) => (
  <EditAzureExtractorDrawer
    documentType={documentType}
  >
    <EditButton
      type={ButtonType.PRIMARY}
    >
      {localize(Localization.EDIT)}
    </EditButton>
  </EditAzureExtractorDrawer>
)

EditAzureExtractorButton.propTypes = {
  documentType: documentTypeShape.isRequired,
}

export {
  EditAzureExtractorButton,
}
