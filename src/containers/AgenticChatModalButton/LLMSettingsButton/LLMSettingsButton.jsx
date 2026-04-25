
import PropTypes from 'prop-types'
import {
  useState,
  useEffect,
} from 'react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { Spin } from '@/components/Spin'
import { localize, Localization } from '@/localization/i18n'
import { notifyWarning } from '@/utils/notification'
import { useChatSettings } from '../hooks'
import { SettingsButton } from '../SettingsButton'
import { LLMSettingsDropdown } from './LLMSettingsDropdown'

const getDisplayedModelName = (llmSettings, providers) => {
  const foundProvider = providers.find((provider) => provider.code === llmSettings.provider)
  const foundModel = foundProvider?.models.find((model) => model.code === llmSettings.model)

  return foundModel?.name
}

const LLMSettingsButton = ({ disabled }) => {
  const [isButtonActive, setIsButtonActive] = useState(false)
  const { activeLLMSettings, setActiveLLMSettings } = useChatSettings()

  const toggleButtonView = () => setIsButtonActive((open) => !open)

  const {
    providers,
    isError,
    isFetching,
  } = useFetchLLMsQuery({}, {
    selectFromResult: ({ data, isError, isFetching }) => ({
      isError,
      isFetching,
      providers: data?.filter((provider) => provider.models.length > 0) ?? [],
    }),
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (isError) {
      notifyWarning(localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
    }
  }, [isError])

  useEffect(() => {
    if (!activeLLMSettings && providers.length > 0) {
      setActiveLLMSettings({
        provider: providers[0].code,
        model: providers[0].models[0].code,
      })
    }
  }, [
    activeLLMSettings,
    providers,
    setActiveLLMSettings,
  ])

  if (isFetching) {
    return (
      <Spin.Centered spinning />
    )
  }

  if (!activeLLMSettings) {
    return null
  }

  const renderTrigger = () => (
    <SettingsButton
      isActive={isButtonActive}
      onClick={toggleButtonView}
      title={getDisplayedModelName(activeLLMSettings, providers)}
    />
  )

  const onModelSelect = (providerCode, modelCode) => setActiveLLMSettings({
    provider: providerCode,
    model: modelCode,
  })

  return (
    <LLMSettingsDropdown
      activeLLMSettings={activeLLMSettings}
      disabled={disabled}
      isVisible={isButtonActive}
      onModelSelect={onModelSelect}
      onVisibleChange={setIsButtonActive}
      providers={providers}
      renderTrigger={renderTrigger}
    />
  )
}

LLMSettingsButton.propTypes = {
  disabled: PropTypes.bool,
}

export {
  LLMSettingsButton,
}
