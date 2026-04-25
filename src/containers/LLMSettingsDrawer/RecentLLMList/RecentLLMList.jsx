
import PropTypes from 'prop-types'
import { ExpandIconPosition } from '@/components/Collapse'
import { Localization, localize } from '@/localization/i18n'
import { llModelShape, llmProviderShape } from '@/models/LLMProvider'
import { LLMCard } from '../LLMCard'
import { StyledCollapse } from './RecentLLMList.styles'

const LLM_COLLAPSE_ID = 'recentModelsId'

const RecentLLMList = ({ llmConfigs, setCurrentSettings }) => (
  <StyledCollapse
    bordered={false}
    collapseId={LLM_COLLAPSE_ID}
    expandIconPosition={ExpandIconPosition.END}
    header={localize(Localization.RECENT_MODELS)}
  >
    {
      llmConfigs.map(({ model, provider }) => (
        <LLMCard
          key={model.code}
          model={model}
          onClick={setCurrentSettings}
          provider={provider}
          showProviderName
        />
      ))
    }
  </StyledCollapse>
)

RecentLLMList.propTypes = {
  llmConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      provider: llmProviderShape,
      model: llModelShape,
    }),
  ).isRequired,
  setCurrentSettings: PropTypes.func.isRequired,
}

export {
  RecentLLMList,
}
