
import isEqual from 'lodash/isEqual'
import {
  useState,
  useCallback,
  useMemo,
} from 'react'
import { Button, ButtonType } from '@/components/Button'
import { UI_ENV_SETTINGS_QUERY_KEY } from '@/constants/navigation'
import { UI_ENV_SETTINGS } from '@/constants/storage'
import { useQueryParams } from '@/hooks/useQueryParams'
import { localize, Localization } from '@/localization/i18n'
import { localStorageWrapper } from '@/utils/localStorageWrapper'
import { ExportImportEnvSettings } from './ExportImportEnvSettings'
import {
  Drawer,
  DrawerContent,
  DrawerFooterWrapper,
  DrawerHeaderWrapper,
} from './UiEnvSettingsDrawer.styles'
import {
  getDefaultEnvs,
  getEnvToRender,
  getInitialLocalEnvs,
} from './utils'

const DRAWER_WIDTH = '35%'

const UiEnvSettingsRenderGuard = () => {
  const { queryParams } = useQueryParams()

  if (!queryParams[UI_ENV_SETTINGS_QUERY_KEY]) {
    return null
  }

  return <UiEnvSettingsDrawer />
}

const UiEnvSettingsDrawer = () => {
  const [overriddenEnvs, setOverriddenEnvs] = useState(() => getInitialLocalEnvs())

  const { queryParams, setQueryParams } = useQueryParams()

  const closeDrawer = useCallback(() => setQueryParams({ [UI_ENV_SETTINGS_QUERY_KEY]: null }), [setQueryParams])

  const getContainer = useCallback(() => document.body, [])

  const submitData = useCallback(() => {
    localStorageWrapper.setItem(UI_ENV_SETTINGS, overriddenEnvs)
    closeDrawer()
    window.location.reload()
  }, [overriddenEnvs, closeDrawer])

  const handleChange = useCallback((envCode, value) => {
    setOverriddenEnvs((prevEnvs) => ({
      ...prevEnvs,
      [envCode]: value,
    }))
  }, [])

  const resetToDefault = useCallback(() => {
    setOverriddenEnvs(getDefaultEnvs())
  }, [])

  const DrawerTitle = useMemo(() => (
    <DrawerHeaderWrapper>
      {localize(Localization.INTERFACE_SETTINGS)}
      <ExportImportEnvSettings />
    </DrawerHeaderWrapper>
  ), [])

  const areCurrentEnvsTheSameTo = useCallback((envConfig) => (
    Object.entries(overriddenEnvs).every(([envCode, value]) => isEqual(value, envConfig[envCode]))
  ), [overriddenEnvs])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <Button.Text
        disabled={areCurrentEnvsTheSameTo(getDefaultEnvs())}
        onClick={resetToDefault}
      >
        {localize(Localization.RESET_ALL_TO_DEFAULT)}
      </Button.Text>
      <Button.Secondary onClick={closeDrawer}>
        {localize(Localization.CANCEL)}
      </Button.Secondary>
      <Button
        disabled={areCurrentEnvsTheSameTo(getInitialLocalEnvs())}
        onClick={submitData}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SUBMIT)}
      </Button>
    </DrawerFooterWrapper>
  ), [resetToDefault, closeDrawer, areCurrentEnvsTheSameTo, submitData])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={getContainer}
      hasCloseIcon={false}
      onClose={closeDrawer}
      open={!!queryParams[UI_ENV_SETTINGS_QUERY_KEY]}
      title={DrawerTitle}
      width={DRAWER_WIDTH}
    >
      <DrawerContent>
        {
          Object.entries(overriddenEnvs).map(([envCode, value]) => {
            const EnvComponent = getEnvToRender()[envCode]
            return EnvComponent && (
              <EnvComponent
                key={envCode}
                envCode={envCode}
                onChange={handleChange}
                value={value || undefined}
              />
            )
          })
        }
      </DrawerContent>
    </Drawer>
  )
}

export {
  UiEnvSettingsRenderGuard as UiEnvSettingsDrawer,
}
