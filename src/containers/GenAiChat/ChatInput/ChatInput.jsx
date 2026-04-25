
import PropTypes from 'prop-types'
import { GEN_AI_PROMPT_MAX_LENGTH } from '@/constants/common'
import { Localization, localize } from '@/localization/i18n'
import { TextArea } from './ChatInput.styles'

const MAX_ROWS = 5

const ChatInput = ({
  prompt,
  setPrompt,
  disabled,
  saveDialog,
}) => {
  const onChange = (e) => setPrompt(e.target.value)

  const onPressEnter = (e) => {
    if (!e.shiftKey) {
      e.preventDefault()
      saveDialog()
    }
  }

  return (
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
  )
}

ChatInput.propTypes = {
  prompt: PropTypes.string.isRequired,
  setPrompt: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  saveDialog: PropTypes.func.isRequired,
}

export {
  ChatInput,
}
