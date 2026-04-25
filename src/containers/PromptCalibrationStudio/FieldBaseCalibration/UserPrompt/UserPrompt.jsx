
import lodashDebounce from 'lodash/debounce'
import PropTypes from 'prop-types'
import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react'
import { PaperPlaneIcon } from '@/components/Icons/PaperPlaneIcon'
import { Input } from '@/components/Input'
import { Tooltip } from '@/components/Tooltip'
import { GEN_AI_PROMPT_MAX_LENGTH } from '@/constants/common'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Label,
  PromptHeader,
  TextButton,
} from './UserPrompt.styles'

const TEXTAREA_CONFIG = {
  minRows: 5,
  maxRows: 15,
}

const DEBOUNCE_TIME = 250

export const UserPrompt = ({
  isLoading,
  setPrompt,
  prompt,
  onExecute,
}) => {
  const [userPrompt, setUserPrompt] = useState(prompt)

  const { activeField, setActiveField } = useFieldCalibration()

  const debouncedOnChange = useMemo(() => (
    lodashDebounce(
      (value) => setPrompt(value),
      DEBOUNCE_TIME,
    )
  ), [setPrompt])

  useEffect(() =>
    () => debouncedOnChange.cancel(),
  [debouncedOnChange])

  const setPromptIsDirty = (prompt) => {
    if (!activeField) {
      return
    }

    const activeFieldPrompt = activeField.query.nodes[0]?.prompt
    const isDirty = activeFieldPrompt !== prompt

    if (activeField.isDirty !== isDirty) {
      setActiveField({
        ...activeField,
        isDirty,
      })
    }
  }

  const onChange = (e) => {
    setUserPrompt(e.target.value)
    debouncedOnChange(e.target.value)
    setPromptIsDirty(e.target.value)
  }

  const executePrompt = useCallback(() => {
    onExecute(userPrompt)
  }, [onExecute, userPrompt])

  const isExecuteDisabled = !userPrompt || activeField?.query.nodes[0]?.prompt === userPrompt || isLoading

  const onKeyDown = useCallback((e) => {
    if (e.shiftKey && e.key === 'Enter' && !isExecuteDisabled) {
      e.preventDefault()
      executePrompt()
    }
  }, [isExecuteDisabled, executePrompt])

  const tooltipTitle = isExecuteDisabled
    ? localize(Localization.EDIT_PROMPT_BEFORE_EXECUTE)
    : localize(Localization.SHIFT_ENTER_SHORTCUT_HINT)

  return (
    <Wrapper>
      <PromptHeader>
        <Label>
          {localize(Localization.PROMPT)}
        </Label>
        <Tooltip title={tooltipTitle}>
          <TextButton
            disabled={isExecuteDisabled}
            loading={isLoading}
            onClick={executePrompt}
          >
            {localize(Localization.EXECUTE)}
            <PaperPlaneIcon />
          </TextButton>
        </Tooltip>
      </PromptHeader>
      <Input.TextArea
        autoSize={TEXTAREA_CONFIG}
        maxLength={GEN_AI_PROMPT_MAX_LENGTH}
        onChange={onChange}
        onKeyDown={onKeyDown}
        showCount
        value={userPrompt}
      />
    </Wrapper>
  )
}

UserPrompt.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onExecute: PropTypes.func.isRequired,
  prompt: PropTypes.string,
  setPrompt: PropTypes.func.isRequired,
}
