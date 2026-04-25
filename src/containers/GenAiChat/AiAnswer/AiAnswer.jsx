
import {
  useMemo,
  useState,
  useCallback,
} from 'react'
import { ShortLogoIcon } from '@/components/Icons/ShortLogoIcon'
import { Spin } from '@/components/Spin'
import { Localization, localize } from '@/localization/i18n'
import { genAiChatMessageShape } from '@/models/GenAiChatDialog'
import { ENV } from '@/utils/env'
import { CopyToClipboardButton } from '../CopyToClipboardButton'
import { SaveToFieldButton } from '../SaveToFieldButton'
import {
  Wrapper,
  LogoWrapper,
  MessageWrapper,
  MessageHeader,
  MessageTime,
  MessageOwner,
  Message,
  SpinWrapper,
  MessageContentWrapper,
} from './AiAnswer.styles'

const AiAnswer = ({
  answer,
  prompt,
}) => {
  const [isCopyButtonVisible, setIsCopyButtonVisible] = useState(false)

  const toggleCopyButton = useCallback(() => {
    setIsCopyButtonVisible((prev) => !prev)
  }, [])

  const Content = useMemo(() => {
    if (!answer?.message && answer?.message !== '') {
      return (
        <SpinWrapper>
          <Spin spinning />
        </SpinWrapper>
      )
    }

    const { message, time } = answer
    const handleMouseEvents = message ? toggleCopyButton : null

    return (
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
            onMouseEnter={handleMouseEvents}
            onMouseLeave={handleMouseEvents}
          >
            {message}
            {
              isCopyButtonVisible && (
                <CopyToClipboardButton
                  text={message}
                />
              )
            }
          </Message>
          {
            (
              ENV.FEATURE_ENRICHMENT ||
              ENV.FEATURE_GEN_AI_KEY_VALUE_FIELDS
            ) &&
              (
                <SaveToFieldButton
                  answer={answer.message}
                  prompt={prompt.message}
                />
              )
          }
        </MessageContentWrapper>
      </>
    )
  }, [
    answer,
    isCopyButtonVisible,
    toggleCopyButton,
    prompt,
  ])

  if (!answer) {
    return null
  }

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
  answer: genAiChatMessageShape,
  prompt: genAiChatMessageShape.isRequired,
}

export {
  AiAnswer,
}
