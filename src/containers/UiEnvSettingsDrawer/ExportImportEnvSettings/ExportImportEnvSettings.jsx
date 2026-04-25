
import { ArrowDownToLine } from '@/components/Icons/ArrowDownToLine'
import { ArrowUpFromLine } from '@/components/Icons/ArrowUpFromLine'
import { Tooltip } from '@/components/Tooltip'
import { UI_ENV_SETTINGS } from '@/constants/storage'
import { Localization, localize } from '@/localization/i18n'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { notifyWarning } from '@/utils/notification'
import {
  importEnvSettings,
  exportEnvSettings,
} from './exportEnvService'
import { BtnGroup, ButtonIcon } from './ExportImportEnvSettings.styles'

const ERROR_MESSAGE = localize(Localization.EXPORT_SERVICE_ENV_SETTINGS_ERROR)

const FILE_NAME_PREFIX = 'ui_env_settings_'

const TEST_ID = {
  EXPORT: 'export-env-settings',
  IMPORT: 'import-env-settings',
}

export const ExportImportEnvSettings = () => {
  const handleExport = () => {
    const preservedEnvs = localStorageWrapper.getItem(UI_ENV_SETTINGS)
    const fileName = `${FILE_NAME_PREFIX}${new Date().toISOString()}.json`
    try {
      exportEnvSettings(preservedEnvs, fileName)
    } catch {
      notifyWarning(ERROR_MESSAGE)
    }
  }

  const handleImport = async () => {
    let envSettings

    try {
      envSettings = await importEnvSettings()
    } catch {
      notifyWarning(ERROR_MESSAGE)
      return
    }

    if (!envSettings) {
      return
    }

    localStorageWrapper.setItem(UI_ENV_SETTINGS, envSettings)
    window.location.reload()
  }

  return (
    <BtnGroup>
      <Tooltip title={localize(Localization.EXPORT_ENVS)}>
        <ButtonIcon
          data-testid={TEST_ID.EXPORT}
          disabled={!localStorageWrapper.getItem(UI_ENV_SETTINGS)}
          icon={<ArrowUpFromLine />}
          onClick={handleExport}
        />
      </Tooltip>
      <Tooltip title={localize(Localization.IMPORT_ENVS)}>
        <ButtonIcon
          data-testid={TEST_ID.IMPORT}
          icon={<ArrowDownToLine />}
          onClick={handleImport}
        />
      </Tooltip>
    </BtnGroup>
  )
}
