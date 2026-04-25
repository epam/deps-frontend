
import PropTypes from 'prop-types'
import { useState } from 'react'
import { CheckDouble } from '@/components/Icons/CheckDouble'
import { CopyIcon } from '@/components/Icons/CopyIcon'
import { Tooltip } from '@/components/Tooltip'
import { Localization, localize } from '@/localization/i18n'
import { MessageActionButton } from '../../GenAiChat/MessageActionButton'
import { Wrapper } from './CopyToClipboardButton.styles'

const TIMER = 2_000

const CopyToClipboardButton = ({
  text,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(true)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setIsTooltipOpen(true)
    setTimeout(() => setIsCopied(false), TIMER)
  }

  const toggleTooltip = () => {
    setIsTooltipOpen((prev) => !prev)
  }

  if (isCopied) {
    return (
      <Wrapper>
        <Tooltip
          open={isTooltipOpen}
          title={localize(Localization.COPIED)}
        >
          <MessageActionButton
            icon={<CheckDouble />}
            onMouseEnter={toggleTooltip}
            onMouseLeave={toggleTooltip}
          />
        </Tooltip>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <MessageActionButton
        icon={<CopyIcon />}
        onClick={copyToClipboard}
      />
    </Wrapper>
  )
}

CopyToClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
}

export {
  CopyToClipboardButton,
}
