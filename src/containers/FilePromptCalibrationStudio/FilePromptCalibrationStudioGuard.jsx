
import { FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY } from '@/constants/navigation'
import { useQueryParams } from '@/hooks/useQueryParams'
import { ENV } from '@/utils/env'
import { FilePromptCalibrationStudioModal } from './FilePromptCalibrationStudioModal'
import { NotConfiguredStateModal } from './NotConfiguredStateModal'

const isPromptCalibrationStudioConfigured = () => (
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_MODEL != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TOP_P != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_TEMPERATURE != null &&
  ENV.FEATURE_PROMPT_CALIBRATION_STUDIO_GROUPING_FACTOR != null
)

const FilePromptCalibrationStudioGuard = () => {
  const { queryParams } = useQueryParams()

  if (
    !ENV.FEATURE_PROMPT_CALIBRATION_STUDIO ||
    !queryParams[FILE_PROMPT_CALIBRATION_STUDIO_QUERY_KEY]
  ) {
    return null
  }

  const isConfigured = isPromptCalibrationStudioConfigured()

  if (!isConfigured) {
    return <NotConfiguredStateModal />
  }

  return <FilePromptCalibrationStudioModal />
}

export {
  FilePromptCalibrationStudioGuard as FilePromptCalibrationStudio,
}
