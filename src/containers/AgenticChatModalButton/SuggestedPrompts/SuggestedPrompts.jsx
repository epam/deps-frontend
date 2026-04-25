
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'
import {
  List,
  PromptItem,
  Title,
  Wrapper,
} from './SuggestedPrompts.styles'

const SUGGESTED_PROMPTS = [
  Localization.AGENTIC_CHAT_PROMPT_OVERVIEW,
  Localization.AGENTIC_CHAT_PROMPT_CREATE_DOCUMENT_TYPE,
  Localization.AGENTIC_CHAT_PROMPT_CONTEXT,
  Localization.AGENTIC_CHAT_PROMPT_EXTRACTION,
]

const SuggestedPrompts = ({
  onPromptClick,
}) => (
  <Wrapper>
    <Title>
      {localize(Localization.AGENTIC_CHAT_POPULAR_PROMPTS_TITLE)}
    </Title>
    <List>
      {
        SUGGESTED_PROMPTS.map((promptKey) => {
          const promptText = localize(promptKey)
          return (
            <PromptItem
              key={promptKey}
              onClick={() => onPromptClick(promptText)}
            >
              {promptText}
            </PromptItem>
          )
        })
      }
    </List>
  </Wrapper>
)

SuggestedPrompts.propTypes = {
  onPromptClick: PropTypes.func.isRequired,
}

export {
  SuggestedPrompts,
}
