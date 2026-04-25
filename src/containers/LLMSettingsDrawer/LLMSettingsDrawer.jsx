
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import { ButtonType, Button } from '@/components/Button'
import { Localization, localize } from '@/localization/i18n'
import {
  llmProviderShape,
  LLMSettings,
  llmSettingsShape,
} from '@/models/LLMProvider'
import { theme } from '@/theme/theme.default'
import { LLMCardList } from './LLMCardList'
import { LLMProviderSelect } from './LLMProviderSelect'
import {
  CancelButton,
  Drawer,
  DrawerFooterWrapper,
  Title,
  SearchInput,
} from './LLMSettingsDrawer.styles'
import { RecentLLMList } from './RecentLLMList'

const hasSubstring = (str, subStr) => (
  str.toLowerCase().includes(subStr.toLowerCase())
)

const mapProviderModelsToLLMCardModels = (provider) => (
  provider.models.map((model) => ({
    ...model,
    provider: {
      name: provider.name,
      code: provider.code,
    },
  }))
)

const LLMSettingsDrawer = ({
  isLoading,
  onSubmit,
  closeDrawer,
  visible,
  activeLLMSettings,
  providers,
  recentLLMsSettings,
}) => {
  const [selectedProviderCode, setSelectedProviderCode] = useState(activeLLMSettings?.provider)
  const [currentProviderCode, setCurrentProviderCode] = useState(activeLLMSettings?.provider)
  const [currentModelCode, setCurrentModelCode] = useState(activeLLMSettings?.model)
  const [searchValue, setSearchValue] = useState('')

  const setCurrentSettings = useCallback((modelCode, providerCode) => {
    setCurrentModelCode(modelCode)
    setCurrentProviderCode(providerCode)
    setSelectedProviderCode(providerCode)
  }, [])

  const currentSettings = useMemo(() => {
    if (!currentModelCode || !currentProviderCode) return null

    return new LLMSettings({
      model: currentModelCode,
      provider: currentProviderCode,
    })
  }, [currentModelCode, currentProviderCode])

  const renderFilteredLLMs = useCallback(() => {
    const models = providers
      .flatMap(mapProviderModelsToLLMCardModels)
      .filter((m) => {
        const { name, description, provider } = m
        const isNameMatched = hasSubstring(name, searchValue)
        const isDescriptionMatch = hasSubstring(description, searchValue)
        const isProviderMatch = hasSubstring(provider.name, searchValue)

        return isNameMatched || isDescriptionMatch || isProviderMatch
      })

    return (
      <LLMCardList
        currentSettings={currentSettings}
        models={models}
        setCurrentSettings={setCurrentSettings}
        showProviderName
      />
    )
  }, [
    providers,
    currentSettings,
    setCurrentSettings,
    searchValue,
  ])

  const closeModelsDrawer = useCallback(() => {
    setSearchValue('')
    closeDrawer()
  }, [closeDrawer])

  const saveSettings = useCallback(() => {
    onSubmit(currentModelCode, currentProviderCode)
    closeModelsDrawer()
  }, [
    onSubmit,
    currentProviderCode,
    currentModelCode,
    closeModelsDrawer,
  ])

  const onCancel = useCallback(() => {
    setCurrentModelCode(activeLLMSettings?.model)
    setCurrentProviderCode(activeLLMSettings?.provider)
    setSelectedProviderCode(activeLLMSettings?.provider)
    closeModelsDrawer()
  }, [
    closeModelsDrawer,
    activeLLMSettings?.model,
    activeLLMSettings?.provider,
  ])

  const isSaveButtonDisabled = useMemo(() => {
    if (!activeLLMSettings) {
      return !(currentModelCode && currentProviderCode)
    }

    return (
      activeLLMSettings.model === currentModelCode &&
      activeLLMSettings.provider === currentProviderCode
    )
  }, [
    activeLLMSettings,
    currentModelCode,
    currentProviderCode,
  ])

  const renderModels = useCallback(() => {
    const provider = providers.find((p) => p.code === selectedProviderCode)
    const models = mapProviderModelsToLLMCardModels(provider)

    return (
      <LLMCardList
        currentSettings={currentSettings}
        models={models}
        setCurrentSettings={setCurrentSettings}
      />
    )
  }, [
    providers,
    currentSettings,
    setCurrentSettings,
    selectedProviderCode,
  ])

  const renderRecentModels = useCallback(() => {
    const config = recentLLMsSettings.map(({ model, provider }) => {
      const { models, ...rest } = providers.find((p) => p.code === provider) ?? {}
      const currentModel = models?.find((m) => m.code === model)

      return {
        provider: rest,
        model: currentModel,
      }
    })

    return (
      <RecentLLMList
        llmConfigs={config}
        setCurrentSettings={setCurrentSettings}
      />
    )
  }, [
    recentLLMsSettings,
    providers,
    setCurrentSettings,
  ])

  const DrawerFooter = useMemo(() => (
    <DrawerFooterWrapper>
      <CancelButton
        disabled={isLoading}
        onClick={onCancel}
      >
        {localize(Localization.CANCEL)}
      </CancelButton>
      <Button
        disabled={isSaveButtonDisabled}
        loading={isLoading}
        onClick={saveSettings}
        type={ButtonType.PRIMARY}
      >
        {localize(Localization.SAVE)}
      </Button>
    </DrawerFooterWrapper>
  ), [
    isLoading,
    onCancel,
    saveSettings,
    isSaveButtonDisabled,
  ])

  const DrawerTitle = useMemo(() => (
    <Title>
      {localize(Localization.PROVIDER_AND_MODEL_SELECTION)}
    </Title>
  ), [])

  const Content = useMemo(() => {
    if (searchValue) {
      return renderFilteredLLMs()
    }

    return (
      <>
        {!!recentLLMsSettings?.length && renderRecentModels()}
        <LLMProviderSelect
          onChange={setSelectedProviderCode}
          providerCode={selectedProviderCode}
          providers={providers}
        />
        {!!selectedProviderCode && renderModels()}
      </>
    )
  }, [
    searchValue,
    recentLLMsSettings?.length,
    renderRecentModels,
    selectedProviderCode,
    providers,
    renderModels,
    renderFilteredLLMs,
  ])

  return (
    <Drawer
      destroyOnClose
      footer={DrawerFooter}
      getContainer={() => document.body}
      hasCloseIcon={false}
      onClose={closeModelsDrawer}
      open={visible}
      title={DrawerTitle}
      width={theme.size.drawerWidth}
    >
      <SearchInput
        autoFocus
        filter={searchValue}
        onChange={setSearchValue}
        placeholder={localize(Localization.SEARCH_BY_MODELS)}
      />
      {Content}
    </Drawer>
  )
}

LLMSettingsDrawer.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  activeLLMSettings: llmSettingsShape,
  providers: PropTypes.arrayOf(
    llmProviderShape,
  ),
  recentLLMsSettings: PropTypes.arrayOf(
    llmSettingsShape,
  ),
}

export {
  LLMSettingsDrawer,
}
