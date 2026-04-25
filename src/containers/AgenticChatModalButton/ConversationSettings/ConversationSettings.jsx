
import PropTypes from 'prop-types'
import { FeatureControl } from '@/components/FeatureControl'
import { FeatureNames } from '@/enums/FeatureNames'
import { ChatContext } from '../ChatContext'
import { LLMSettingsButton } from '../LLMSettingsButton'
import { PageSettingsButton } from '../PageSettingsButton'
import {
  ButtonsWrapper,
  Separator,
  Wrapper,
} from './ConversationSettings.styles'

const ConversationSettings = ({ disabled }) => (
  <Wrapper>
    <ChatContext
      disabled={disabled}
    />
    <FeatureControl featureName={FeatureNames.SHOW_NOT_IMPLEMENTED}>
      <ButtonsWrapper>
        <PageSettingsButton
          disabled={disabled}
        />
        <Separator />
        <LLMSettingsButton
          disabled={disabled}
        />
      </ButtonsWrapper>
    </FeatureControl>
  </Wrapper>
)

ConversationSettings.propTypes = {
  disabled: PropTypes.bool,
}

export {
  ConversationSettings,
}
