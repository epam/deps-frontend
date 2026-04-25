
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { Button } from '@/components/Button'
import { EXPORTABLE_EXTRACTION_TYPES } from '@/constants/documentType'
import {
  DocumentTypeFilterKey,
  FILTERS,
  EXTRACTION_TYPE_FILTER_KEY,
} from '@/constants/navigation'
import { AzureExtractorValidationStatusButton } from '@/containers/AzureExtractorValidationStatusButton'
import { DeleteDocumentTypeButton } from '@/containers/DeleteDocumentTypeButton'
import { DocumentTypeExportButton } from '@/containers/DocumentTypeExportButton'
import { DocumentTypeWorkflowConfiguration } from '@/containers/DocumentTypeWorkflowConfiguration'
import { EditAzureExtractorButton } from '@/containers/EditAzureExtractorButton'
import { EditDocumentTypeButton } from '@/containers/EditDocumentTypeButton'
import { GoToAzureButton } from '@/containers/GoToAzureButton'
import { PageNavigationHeader } from '@/containers/PageNavigationHeader'
import { ExtractionType, RESOURCE_EXTRACTION_TYPE } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { documentTypeShape } from '@/models/DocumentType'
import { BASE_DOCUMENT_TYPES_FILTER_CONFIG } from '@/models/DocumentTypesFilterConfig'
import { ENV } from '@/utils/env'
import { navigationMap } from '@/utils/navigationMap'
import {
  Controls,
  ExtractionTypeTag,
  HeaderExtraWrapper,
} from './DocumentTypeHeader.styles'

const EXTRACTION_TYPE_TO_FILTER_KEY = {
  [ExtractionType.TEMPLATE]: EXTRACTION_TYPE_FILTER_KEY.templates,
  [ExtractionType.PLUGIN]: EXTRACTION_TYPE_FILTER_KEY.mlModels,
  [ExtractionType.ML]: EXTRACTION_TYPE_FILTER_KEY.mlModels,
  [ExtractionType.PROTOTYPE]: EXTRACTION_TYPE_FILTER_KEY.prototypes,
  [ExtractionType.AI_PROMPTED]: EXTRACTION_TYPE_FILTER_KEY.aiPrompted,
  [ExtractionType.AZURE_CLOUD_EXTRACTOR]: EXTRACTION_TYPE_FILTER_KEY.azureCloudExtractor,
}

const EXTRACTION_TYPE_EDIT_COMPONENT = {
  [ExtractionType.TEMPLATE]: EditDocumentTypeButton,
  [ExtractionType.PROTOTYPE]: EditDocumentTypeButton,
  [ExtractionType.AZURE_CLOUD_EXTRACTOR]: EditAzureExtractorButton,
}

const DocumentTypeHeader = ({
  documentType,
}) => {
  const dispatch = useDispatch()
  const extractionType = documentType.extractionType || ExtractionType.AI_PROMPTED

  const goToDocumentTypesPage = () => {
    const pathname = navigationMap.documentTypes()
    const extractionTypeFilterKey = EXTRACTION_TYPE_TO_FILTER_KEY[extractionType]

    dispatch(goTo(pathname, {
      [FILTERS]: {
        ...BASE_DOCUMENT_TYPES_FILTER_CONFIG,
        [DocumentTypeFilterKey.EXTRACTION_TYPE]: extractionTypeFilterKey,
      },
    }))
  }

  const renderDeleteButton = (onClick) => (
    <Button.Secondary
      onClick={onClick}
    >
      {localize(Localization.DELETE)}
    </Button.Secondary>
  )

  const renderHeaderExtra = () => {
    const isDeleteAvailable = (
      extractionType === ExtractionType.TEMPLATE ||
      extractionType === ExtractionType.PROTOTYPE ||
      extractionType === ExtractionType.AZURE_CLOUD_EXTRACTOR ||
      extractionType === ExtractionType.AI_PROMPTED
    )

    const isExportAvailable = ENV.FEATURE_DOCUMENT_TYPE_IMPORT_EXPORT && EXPORTABLE_EXTRACTION_TYPES.includes(extractionType)

    const extractionTypeText = RESOURCE_EXTRACTION_TYPE[extractionType]

    const EditButtonComponent = EXTRACTION_TYPE_EDIT_COMPONENT[extractionType]

    return (
      <HeaderExtraWrapper>
        <ExtractionTypeTag>
          {extractionTypeText ?? localize(Localization.AI_PROMPTED)}
        </ExtractionTypeTag>
        <Controls>
          <DocumentTypeWorkflowConfiguration documentType={documentType} />
          {
            (extractionType === ExtractionType.AZURE_CLOUD_EXTRACTOR) && (
              <>
                <AzureExtractorValidationStatusButton
                  documentType={documentType}
                />
                <GoToAzureButton />
              </>
            )
          }
          {
            isExportAvailable && <DocumentTypeExportButton />
          }
          {
            isDeleteAvailable && (
              <DeleteDocumentTypeButton
                documentType={documentType}
                onAfterDelete={goToDocumentTypesPage}
                renderTrigger={renderDeleteButton}
              />
            )
          }
          {
            EditButtonComponent && (
              <EditButtonComponent
                documentType={documentType}
              />
            )
          }
        </Controls>
      </HeaderExtraWrapper>
    )
  }

  return (
    <PageNavigationHeader
      parentPath={navigationMap.documentTypes()}
      renderExtra={renderHeaderExtra}
      title={documentType?.name}
    />
  )
}

DocumentTypeHeader.propTypes = {
  documentType: documentTypeShape.isRequired,
}

export {
  DocumentTypeHeader,
}
