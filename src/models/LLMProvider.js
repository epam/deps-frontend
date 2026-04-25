
import PropTypes from 'prop-types'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { ENV } from '@/utils/env'

const separationSymbol = '@'
const displayedSeparationSymbol = '|'

class LLMSettings {
  constructor ({
    model,
    provider,
  }) {
    this.model = model
    this.provider = provider
  }

  static llmTypeToSettings = (llmType) => {
    const [provider, model] = llmType.split(separationSymbol)

    if (
      !provider ||
      !model ||
      !LLMProvider.getAvailable([{ code: provider }])?.length
    ) {
      return null
    }

    return {
      provider,
      model,
    }
  }

  static settingsToLLMType = (provider, model) => `${provider}${separationSymbol}${model}`

  static settingsToDisplayedLLMType = (providerName, modelName) => `${providerName} ${displayedSeparationSymbol} ${modelName}`

  static isLLMTypeFormatValid = (llmType) => !!LLMSettings.llmTypeToSettings(llmType)

  static getDisplayedLLMType = (providerCode, modelCode, providers) => {
    const foundProvider = providers.find((provider) => provider.code === providerCode)
    const foundModel = foundProvider?.models.find((model) => model.code === modelCode)

    if (!foundModel) {
      return null
    }

    return `${foundProvider.name} ${displayedSeparationSymbol} ${foundModel.name}`
  }
}

const llmSettingsShape = PropTypes.shape({
  model: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
})

class LLModel {
  constructor ({
    name,
    code,
    description = '',
    provider,
    contextType,
  }) {
    this.name = name
    this.code = code
    this.description = description
    this.contextType = contextType
    provider && (this.provider = provider)
  }
}

const llModelShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  contextType: PropTypes.oneOf(
    Object.values(LLMModelContextType),
  ).isRequired,
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }),
})

class LLMProvider {
  constructor ({
    code,
    name,
    models,
  }) {
    this.code = code
    this.name = name
    this.models = models
  }

  static toOption = (provider) => ({
    value: provider.code,
    text: provider.name,
  })

  static getAvailable = (providers) => {
    const hiddenLlmProviders = ENV.FEATURE_HIDDEN_LLM_PROVIDERS || []

    if (
      !hiddenLlmProviders ||
      !hiddenLlmProviders.length ||
      !providers
    ) {
      return providers
    }

    return providers.filter((p) => !hiddenLlmProviders.includes(p.code))
  }
}

const llmProviderShape = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  models: PropTypes.arrayOf(
    llModelShape,
  ),
})

export {
  LLModel,
  LLMProvider,
  LLMSettings,
  llmProviderShape,
  llModelShape,
  llmSettingsShape,
}
