
import PropTypes from 'prop-types'
import {
  useState,
  useCallback,
  useMemo,
} from 'react'
import { ButtonType } from '@/components/Button'
import { Spin } from '@/components/Spin'
import { LLMSettingsDrawer } from '@/containers/LLMSettingsDrawer'
import { Localization, localize } from '@/localization/i18n'
import { llmProviderShape, llmSettingsShape } from '@/models/LLMProvider'
import { ToggleDrawerButton } from './SelectLLMSettingsButton.styles'

const findProviderAndModelInfo = (providerCode, modelCode, providersList) => {
  const foundProvider = providersList?.find((provider) => provider.code === providerCode)
  const foundModel = foundProvider?.models.find((model) => model.code === modelCode)

  return {
    foundProvider,
    foundModel,
  }
}

const SelectLLMSettingsButton = ({
  activeLLMSettings,
  isLoading,
  setActiveLLMSettings,
  recentLLMsSettings,
  providers,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  const toggleDrawer = () => setIsDrawerVisible((prev) => !prev)

  const onSubmit = useCallback((model, provider) => {
    setActiveLLMSettings({
      model,
      provider,
    })
  }, [setActiveLLMSettings])

  const DrawerButton = useMemo(() => {
    const { provider, model } = activeLLMSettings || {}
    const { foundProvider, foundModel } = findProviderAndModelInfo(provider, model, providers)
    const buttonText = (
      activeLLMSettings
        ? `${foundProvider?.name} | ${foundModel?.name}`
        : localize(Localization.SELECT_LLM_TYPE)
    )

    return (
      <ToggleDrawerButton
        disabled={!providers?.length}
        loading={isLoading}
        onClick={toggleDrawer}
        type={ButtonType.DEFAULT}
      >
        { buttonText}
      </ToggleDrawerButton>
    )
  }, [
    activeLLMSettings,
    isLoading,
    providers,
  ])

  if (isLoading) {
    return <Spin.Centered spinning />
  }

  return (
    <>
      {DrawerButton}
      <LLMSettingsDrawer
        activeLLMSettings={activeLLMSettings}
        closeDrawer={toggleDrawer}
        isLoading={isLoading}
        onSubmit={onSubmit}
        providers={providers}
        recentLLMsSettings={recentLLMsSettings}
        visible={isDrawerVisible}
      />
    </>
  )
}

SelectLLMSettingsButton.propTypes = {
  setActiveLLMSettings: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  activeLLMSettings: llmSettingsShape,
  providers: PropTypes.arrayOf(
    llmProviderShape,
  ),
  recentLLMsSettings: PropTypes.arrayOf(
    llmSettingsShape,
  ),
}

export {
  SelectLLMSettingsButton,
}
