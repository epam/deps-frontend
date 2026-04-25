
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { ExtractionType } from '@/enums/ExtractionType'
import { documentTypesStateSelector } from '@/selectors/documentTypes'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { ENV } from '@/utils/env'
import { AIPromptedCard } from './AIPromptedCard'
import { AzureCloudNativeCard } from './AzureCloudNativeCard'
import { CardsWrapper } from './DashboardCards.styles'
import { DocumentsCard } from './DocumentsCard'
import { ModelsCard } from './ModelsCard'
import { PrototypesCard } from './PrototypesCard'
import { TemplatesCard } from './TemplatesCard'
import { UsersCard } from './UsersCard'

const DashboardCards = () => {
  const dispatch = useDispatch()
  const documentTypes = Object.values(useSelector(documentTypesStateSelector))
  const areDocumentTypesFetching = useSelector(areTypesFetchingSelector)

  const getDocumentTypesCount = useCallback((extractionType) => {
    const types = documentTypes.filter((type) => type.extractionType === extractionType)

    return types.length
  }, [documentTypes])

  const getAIPromptedTypesCount = useCallback(() => {
    const types = documentTypes.filter((type) =>
      type.extractionType === null || type.extractionType === ExtractionType.AI_PROMPTED)

    return types.length
  }, [documentTypes])

  useEffect(() => {
    dispatch(fetchDocumentTypes())
  }, [dispatch])

  return (
    <CardsWrapper>
      {
        ENV.FEATURE_TEMPLATES && (
          <TemplatesCard
            count={getDocumentTypesCount(ExtractionType.TEMPLATE)}
            isFetching={areDocumentTypesFetching}
          />
        )
      }
      {
        ENV.FEATURE_MACHINE_LEARNING_MODELS && (
          <ModelsCard
            count={getDocumentTypesCount(ExtractionType.PLUGIN)}
            isFetching={areDocumentTypesFetching}
          />
        )
      }
      <DocumentsCard />
      {
        ENV.FEATURE_USER_MANAGEMENT &&
        <UsersCard />
      }
      {
        ENV.FEATURE_PROTOTYPES && (
          <PrototypesCard
            count={getDocumentTypesCount(ExtractionType.PROTOTYPE)}
            isFetching={areDocumentTypesFetching}
          />
        )
      }
      {
        ENV.FEATURE_AI_PROMPTED_EXTRACTORS && (
          <AIPromptedCard
            count={getAIPromptedTypesCount()}
            isFetching={areDocumentTypesFetching}
          />
        )
      }
      {
        ENV.FEATURE_AZURE_CLOUD_NATIVE_EXTRACTOR && (
          <AzureCloudNativeCard
            count={getDocumentTypesCount(ExtractionType.AZURE_CLOUD_EXTRACTOR)}
            isFetching={areDocumentTypesFetching}
          />
        )
      }
    </CardsWrapper>
  )
}

export {
  DashboardCards,
}
