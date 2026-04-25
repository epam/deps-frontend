
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { removeChatDialogs } from '@/actions/genAiChat'
import { deleteAiConversation } from '@/api/aiConversationApi'
import { DotsVerticalIcon } from '@/components/Icons/DotsVerticalIcon'
import { DownloadBoldIcon } from '@/components/Icons/DownloadBoldIcon'
import { TrashIcon } from '@/components/Icons/TrashIcon'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { Modal } from '@/components/Modal'
import { DownloadLink } from '@/containers/DownloadLink'
import { FileExtension } from '@/enums/FileExtension'
import { MimeType } from '@/enums/MimeType'
import { Localization, localize } from '@/localization/i18n'
import { documentShape } from '@/models/Document'
import { genAiChatDialogShape } from '@/models/GenAiChatDialog'
import { getDownloadFileName, removeFileExtension } from '@/utils/file'
import { notifyWarning } from '@/utils/notification'
import {
  ClearHistoryButton,
  DownloadButton,
  IconButton,
} from './MoreOptionsCommandMenu.styles'

const CONFIRM_MODAL_WIDTH = 460

const MORE_OPTIONS_BUTTON_TOOLTIP = {
  title: localize(Localization.MORE_OPTIONS),
}

const mapDialogsToConversation = (dialogs, document) => {
  const {
    _id: documentId,
    title: documentName,
    documentType,
  } = document

  const conversation = dialogs.map(({ prompt, answer }) => ({
    prompt: prompt.message,
    answer: answer.message,
  }))

  return ({
    documentName,
    documentId,
    documentTypeName: documentType.name,
    conversation,
  })
}

const getBlob = (dialogs, document) => {
  const conversation = mapDialogsToConversation(dialogs, document)
  const stringifiedConversation = JSON.stringify(conversation, null, 2)

  return new Blob([stringifiedConversation], {
    type: MimeType.APPLICATION_JSON,
  })
}

export const MoreOptionsCommandMenu = ({
  dialogs,
  disabled,
  document,
}) => {
  const dispatch = useDispatch()

  const deleteConversation = useCallback(async () => {
    try {
      await deleteAiConversation(document._id)
      dispatch(removeChatDialogs(document._id))
    } catch {
      notifyWarning(localize(Localization.DEFAULT_ERROR_MESSAGE))
    }
  }, [dispatch, document._id])

  const confirmDeletion = useCallback((e) => {
    e.stopPropagation()

    Modal.confirm({
      title: localize(Localization.CLEAR_AI_CONVERSATION_HISTORY_CONFIRM_MESSAGE),
      onOk: deleteConversation,
      okText: localize(Localization.DELETE),
      centered: true,
      width: CONFIRM_MODAL_WIDTH,
    })
  }, [deleteConversation])

  const renderDropdownItems = useCallback(() => ([
    {
      content: () => (
        <DownloadButton>
          <DownloadLink
            fileName={
              getDownloadFileName({
                extension: FileExtension.JSON,
                title: removeFileExtension(document.title),
              })
            }
            getBlob={() => getBlob(dialogs, document)}
          >
            {localize(Localization.DOWNLOAD)}
            <DownloadBoldIcon />
          </DownloadLink>
        </DownloadButton>
      ),
    },
    {
      content: () => (
        <ClearHistoryButton onClick={confirmDeletion}>
          {localize(Localization.CLEAR_HISTORY)}
          <TrashIcon />
        </ClearHistoryButton>
      ),
    },
  ]), [
    confirmDeletion,
    dialogs,
    document,
  ])

  return (
    <CustomMenu
      disabled={disabled}
      items={renderDropdownItems()}
    >
      <IconButton
        icon={<DotsVerticalIcon />}
        tooltip={MORE_OPTIONS_BUTTON_TOOLTIP}
      />
    </CustomMenu>
  )
}

MoreOptionsCommandMenu.propTypes = {
  document: documentShape.isRequired,
  dialogs: PropTypes.arrayOf(genAiChatDialogShape),
  disabled: PropTypes.bool,
}
