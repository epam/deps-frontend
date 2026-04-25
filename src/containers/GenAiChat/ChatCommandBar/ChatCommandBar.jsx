
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { CommandBar } from '@/components/CommandBar'
import { PaperPlaneIcon } from '@/components/Icons/PaperPlaneIcon'
import { localize, Localization } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { genAiChatDialogShape } from '@/models/GenAiChatDialog'
import { MoreOptionsCommandMenu } from '../MoreOptionsCommandMenu'
import { IconButton } from './ChatCommandBar.styles'

const SEND_BUTTON_TOOLTIP = {
  title: localize(Localization.SEND_MESSAGE),
}

const ChatCommandBar = ({
  dialogs,
  saveDialog,
  isSendPromptDisabled,
  document,
}) => {
  const commands = useMemo(() => [
    {
      renderComponent: () => (
        <IconButton
          disabled={isSendPromptDisabled}
          icon={<PaperPlaneIcon />}
          onClick={saveDialog}
          tooltip={SEND_BUTTON_TOOLTIP}
        />
      ),
    },
    {
      renderComponent: () => (
        <MoreOptionsCommandMenu
          dialogs={dialogs}
          disabled={!dialogs.length}
          document={document}
        />
      ),
    },
  ], [
    dialogs,
    isSendPromptDisabled,
    document,
    saveDialog,
  ])

  return (
    <CommandBar
      commands={commands}
    />
  )
}

ChatCommandBar.propTypes = {
  saveDialog: PropTypes.func.isRequired,
  isSendPromptDisabled: PropTypes.bool.isRequired,
  document: documentShape.isRequired,
  dialogs: PropTypes.arrayOf(genAiChatDialogShape),
}

export {
  ChatCommandBar,
}
