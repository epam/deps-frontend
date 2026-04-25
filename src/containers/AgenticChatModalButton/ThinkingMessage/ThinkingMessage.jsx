
import dayjs from 'dayjs'
import { AiAnswer } from '@/containers/AiAnswer'
import { Localization, localize } from '@/localization/i18n'
import {
  MessageWrapper,
  AnimatedDots,
  AnimatedThoughtIcon,
} from './ThinkingMessage.styles'

const ThinkingMessage = () => (
  <AiAnswer
    allowSave={false}
    answer={
      (
        <MessageWrapper>
          <AnimatedThoughtIcon />
          <span>
            {localize(Localization.THINKING)}
            <AnimatedDots>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </AnimatedDots>
          </span>
        </MessageWrapper>
      )
    }
    time={dayjs().format('HH:mm')}
  />
)

export {
  ThinkingMessage,
}
