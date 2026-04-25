
import PropTypes from 'prop-types'
import { NoData } from '@/components/NoData'
import { llModelShape, llmSettingsShape } from '@/models/LLMProvider'
import { LLMCard } from '../LLMCard'

const LLMCardList = ({
  setCurrentSettings,
  currentSettings,
  models,
  showProviderName,
}) => {
  const isModelActive = ({ code, provider }) => (
    currentSettings?.model === code &&
    currentSettings?.provider === provider.code
  )

  if (!models.length) {
    return (
      <NoData />
    )
  }

  return (
    models.map((model) => (
      <LLMCard
        key={`${model.provider.code}-${model.code}`}
        isActive={isModelActive(model)}
        model={model}
        onClick={setCurrentSettings}
        provider={model.provider}
        showProviderName={showProviderName}
      />
    ))
  )
}

LLMCardList.propTypes = {
  setCurrentSettings: PropTypes.func.isRequired,
  currentSettings: llmSettingsShape,
  models: PropTypes.arrayOf(
    llModelShape,
  ),
  showProviderName: PropTypes.bool,
}

export {
  LLMCardList,
}
