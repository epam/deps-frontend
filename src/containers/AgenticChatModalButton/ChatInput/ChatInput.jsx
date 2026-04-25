
import PropTypes from 'prop-types'
import { PaperPlaneIcon } from '@/components/Icons/PaperPlaneIcon'
import { XMarkIcon } from '@/components/Icons/XMarkIcon'
import { GEN_AI_PROMPT_MAX_LENGTH } from '@/constants/common'
import { Localization, localize } from '@/localization/i18n'
import {
  CancelButton,
  SendMessageButton,
  TextArea,
  Wrapper,
} from './ChatInput.styles'

const MAX_ROWS = 5

const ChatInput = ({
  prompt,
  setPrompt,
  disabled,
  saveDialog,
  onCancel,
}) => {
  const onChange = (e) => setPrompt(e.target.value)

  const onPressEnter = (e) => {
    if (!e.shiftKey) {
      e.preventDefault()
      saveDialog()
    }
  }

  const isSendPromptDisabled = disabled || !prompt.trim()

  return (
    <Wrapper>
      <TextArea
        autoSize={{ maxRows: MAX_ROWS }}
        disabled={disabled}
        maxLength={GEN_AI_PROMPT_MAX_LENGTH}
        onChange={onChange}
        onPressEnter={onPressEnter}
        placeholder={localize(Localization.TYPE_MESSAGE)}
        showCount
        value={prompt}
      />
      {
        onCancel && (
          <CancelButton
            icon={<XMarkIcon />}
            onClick={onCancel}
          />
        )
      }
      <SendMessageButton
        disabled={isSendPromptDisabled}
        icon={<PaperPlaneIcon />}
        onClick={() => saveDialog()}
      />
    </Wrapper>
  )
}

ChatInput.propTypes = {
  prompt: PropTypes.string.isRequired,
  setPrompt: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  saveDialog: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
}

export {
  ChatInput,
}
