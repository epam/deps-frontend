
import { localize, Localization } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import { saveToFile, readFile } from '@/utils/file'
import { jsonTryParse } from '@/utils/jsonTryParse'

const ERROR_MESSAGE = localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR)

const isValid = (envSettings) => (
  typeof envSettings === 'object' &&
  envSettings !== null &&
  Object.keys(envSettings).every((key) => key in ENV)
)

const importEnvSettings = async () => {
  const content = await readFile('@/application/json')
  const envSettings = jsonTryParse(content)

  if (
    !content ||
    !envSettings ||
    !isValid(envSettings)
  ) {
    throw new Error(ERROR_MESSAGE)
  }
  return envSettings
}

const exportEnvSettings = (envSettings, fileName) => {
  if (!isValid(envSettings)) {
    throw new Error(ERROR_MESSAGE)
  }

  saveToFile(fileName, 'UTF-8', JSON.stringify(envSettings))
}

export {
  importEnvSettings,
  exportEnvSettings,
}
