
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { SelectOption } from '@/components/Select'
import {
  AI_CONTEXT_TO_LABEL_MAPPER,
  AI_CONTEXT_TO_TOOLTIP_MAPPER,
  AiContext,
} from './AiContext'
import { Select } from './AiContextSelect.styles'

const getTooltipContainer = (trigger) =>
  trigger.closest('.ant-select')?.parentNode || document.body

const AiContextSelect = ({
  onChange,
  value,
}) => {
  const options = useMemo(() => (
    Object.values(AiContext).map((contextValue) => (
      new SelectOption(
        contextValue,
        AI_CONTEXT_TO_LABEL_MAPPER[contextValue],
        AI_CONTEXT_TO_TOOLTIP_MAPPER[contextValue],
      )
    ))
  ), [])

  return (
    <Select
      getTooltipContainer={getTooltipContainer}
      onChange={onChange}
      options={options}
      value={value}
    />
  )
}

AiContextSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export {
  AiContextSelect,
}
