
import PropTypes from 'prop-types'
import { memo } from 'react'
import { LayerGroupIcon } from '@/components/Icons/LayerGroupIcon'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import {
  PromptChainText,
  PromptName,
  PromptsNumber,
  SinglePrompt,
  TagWrapper,
  TagTitle,
} from './PromptChainCell.styles'

const PromptChainCell = memo(({ promptChain }) => {
  if (promptChain.length === 1) {
    return <SinglePrompt text={promptChain[0].prompt} />
  }

  const promptChainTooltip = () => (
    <div>
      {
        promptChain.map((item, index) => (
          <div key={item.id}>
            <PromptName>{`${index + 1}. ${item.name}`}</PromptName>
            <PromptChainText>{item.prompt}</PromptChainText>
          </div>
        ))
      }
    </div>
  )

  return (
    <Tooltip title={promptChainTooltip}>
      <TagWrapper closable={false}>
        <LayerGroupIcon />
        <TagTitle>
          {localize(Localization.PROMPTS)}
        </TagTitle>
        <PromptsNumber>
          {promptChain.length}
        </PromptsNumber>
      </TagWrapper>
    </Tooltip>
  )
})

PromptChainCell.propTypes = {
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape).isRequired,
}

export {
  PromptChainCell,
}
