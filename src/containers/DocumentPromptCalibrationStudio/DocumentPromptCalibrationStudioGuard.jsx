
import { useSelector } from 'react-redux'
import { DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { DocumentState } from '@/enums/DocumentState'
import { useQueryParams } from '@/hooks/useQueryParams'
import { UNKNOWN_DOCUMENT_TYPE } from '@/models/DocumentType'
import { documentSelector, documentTypeSelector } from '@/selectors/documentReviewPage'
import { ENV } from '@/utils/env'
import { DocumentPromptCalibrationStudioModal } from './DocumentPromptCalibrationStudioModal'
import { NotConfiguredStateModal } from './NotConfiguredStateModal'

const isPromptCalibrationStudioConfigured = () => (
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR != null
)

const DocumentPromptCalibrationStudioGuard = () => {
  const { queryParams } = useQueryParams()

  const document = useSelector(documentSelector)
  const documentType = useSelector(documentTypeSelector)

  const isAvailable = (
    document.state === DocumentState.IN_REVIEW &&
    documentType !== UNKNOWN_DOCUMENT_TYPE
  )

  if (
    !ENV.FEATURE_PROMPT_CALIBRATION_STUDIO ||
    !queryParams[DOCUMENT_PROMPT_CALIBRATION_STUDIO_QUERY_KEY] ||
    !isAvailable
  ) {
    return null
  }

  const isConfigured = isPromptCalibrationStudioConfigured()

  if (!isConfigured) {
    return <NotConfiguredStateModal />
  }

  return <DocumentPromptCalibrationStudioModal />
}

export {
  DocumentPromptCalibrationStudioGuard as DocumentPromptCalibrationStudio,
}
