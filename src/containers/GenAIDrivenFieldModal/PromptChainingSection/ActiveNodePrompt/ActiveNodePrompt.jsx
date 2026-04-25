
import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'
import { REQUIRED_FIELD_MARKER } from '@/containers/GenAIDrivenFieldModal/constants'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { llmExtractionQueryNodeShape } from '@/models/LLMExtractor'
import {
  PromptInputTooltip,
  RequiredMark,
  PromptInput,
} from './ActiveNodePrompt.styles'

const setFocus = (el) => {
  setTimeout(() => {
    el.focus()
  })
}

const ActiveNodePrompt = ({
  onChange,
  activeNode,
}) => {
  const inputRef = useRef(null)
  const value = activeNode?.prompt || ''

  useEffect(() => {
    if (activeNode && inputRef.current) {
      setFocus(inputRef.current)
    }
  }, [activeNode])

  return (
    <PromptInputTooltip
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      open={!value}
      placement={Placement.TOP_LEFT}
      title={localize(Localization.REQUIRED_FIELD)}
    >
      <PromptInput
        $hasRequiredMark={!value}
        innerRef={inputRef}
        onChange={onChange}
        placeholder={localize(Localization.PROMPT_PLACEHOLDER)}
        value={value}
      />
      {
        !value && (
          <RequiredMark>{REQUIRED_FIELD_MARKER}</RequiredMark>
        )
      }
    </PromptInputTooltip>
  )
}

ActiveNodePrompt.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeNode: llmExtractionQueryNodeShape,
}

export {
  ActiveNodePrompt,
}
