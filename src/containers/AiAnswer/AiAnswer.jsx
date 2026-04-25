
import PropTypes from 'prop-types'
import {
  useMemo,
  useState,
  useCallback,
} from 'react'
import { ShortLogoIcon } from '@/components/Icons/ShortLogoIcon'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import {
  Wrapper,
  LogoWrapper,
  MessageWrapper,
  MessageHeader,
  MessageTime,
  MessageOwner,
  Message,
  MessageContentWrapper,
} from './AiAnswer.styles'
import { CopyToClipboardButton } from './CopyToClipboardButton'
import { SaveToFieldButton } from './SaveToFieldButton'

const AiAnswer = ({
  allowSave,
  answer,
  prompt,
  time,
}) => {
  const [isCopyButtonVisible, setIsCopyButtonVisible] = useState(false)

  const toggleCopyButton = useCallback(() => {
    setIsCopyButtonVisible((prev) => !prev)
  }, [])

  const canCopy = typeof answer === 'string'
  const isSaveFieldFeatureEnabled = ENV.FEATURE_ENRICHMENT || ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS
  const showSaveButton = allowSave && isSaveFieldFeatureEnabled

  const Content = useMemo(() => (
    <>
      <MessageHeader>
        <MessageOwner>
          {localize(Localization.DEPS_GEN_AI)}
        </MessageOwner>
        <MessageTime>
          {time}
        </MessageTime>
      </MessageHeader>
      <MessageContentWrapper>
        <Message
          {...(canCopy && {
            onMouseEnter: toggleCopyButton,
            onMouseLeave: toggleCopyButton,
          })}
        >
          {answer}
          {
            canCopy && isCopyButtonVisible && (
              <CopyToClipboardButton
                text={answer}
              />
            )
          }
        </Message>
        {
          showSaveButton && (
            <SaveToFieldButton
              answer={answer}
              prompt={prompt}
            />
          )
        }
      </MessageContentWrapper>
    </>
  ), [
    isCopyButtonVisible,
    canCopy,
    answer,
    prompt,
    showSaveButton,
    time,
    toggleCopyButton,
  ])

  return (
    <Wrapper>
      <LogoWrapper>
        <ShortLogoIcon />
      </LogoWrapper>
      <MessageWrapper>
        {Content}
      </MessageWrapper>
    </Wrapper>
  )
}

AiAnswer.propTypes = {
  allowSave: PropTypes.bool.isRequired,
  answer: PropTypes.node,
  prompt: PropTypes.string,
  time: PropTypes.string.isRequired,
}

export {
  AiAnswer,
}
