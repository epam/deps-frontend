
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { AIMicrochipIcon } from '@/components/Icons/AIMicrochipIcon'
import { SitemapIcon } from '@/components/Icons/SitemapIcon'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import { ENV } from '@/utils/env'
import {
  ActionButton,
  SinglePromptText,
  PromptChainText,
  PromptName,
} from './PromptPreviewButton.styles'

const PromptPreviewButton = ({
  promptChain,
}) => {
  if (!promptChain || !ENV.FEATURE_LLM_EXTRACTORS) {
    return null
  }

  const renderButton = (label, icon) => (
    <ActionButton type={ButtonType.LINK}>
      {icon}
      {label}
    </ActionButton>
  )

  if (promptChain.length === 1) {
    const promptText = promptChain[0].prompt
    return (
      <Tooltip
        placement={Placement.TOP_LEFT}
        title={<SinglePromptText>{promptText}</SinglePromptText>}
      >
        {renderButton(localize(Localization.PROMPT), <AIMicrochipIcon />)}
      </Tooltip>
    )
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
    <Tooltip
      placement={Placement.TOP_LEFT}
      title={promptChainTooltip}
    >
      {renderButton(localize(Localization.PROMPTS), <SitemapIcon />)}
    </Tooltip>
  )
}

PromptPreviewButton.propTypes = {
  promptChain: PropTypes.arrayOf(llmExtractionQueryNodeShape),
}

export {
  PromptPreviewButton,
}
