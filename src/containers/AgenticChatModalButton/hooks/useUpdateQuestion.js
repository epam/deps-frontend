
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateChatDialog } from '@/actions/agenticChat'
import { AgenticChatDialogMessage, AgenticChatDialog } from '@/models/AgenticChat'
import { selectAgenticChatByConversationId } from '@/selectors/agenticChat'

export const useUpdateQuestion = ({
  conversationId,
  editMessage,
}) => {
  const [editedCompletionId, setEditedCompletionId] = useState(null)
  const [updatedQuestion, setUpdatedQuestion] = useState('')

  const dialogs = useSelector(selectAgenticChatByConversationId(conversationId))
  const dispatch = useDispatch()

  const setEditingMode = useCallback((completionId, questionText) => {
    setUpdatedQuestion(questionText)
    setEditedCompletionId(completionId)
  }, [])

  const resetEditingMode = useCallback(() => {
    setUpdatedQuestion('')
    setEditedCompletionId(null)
  }, [])

  const updateDialog = useCallback(() => {
    const editedIndex = dialogs.findIndex(({ id }) => id === editedCompletionId)
    const updatedCompletions = dialogs.slice(0, editedIndex + 1).map((completion) => {
      if (completion.id !== editedCompletionId) {
        return completion
      }

      return new AgenticChatDialog({
        id: completion.id,
        conversationId,
        question: new AgenticChatDialogMessage(dayjs().format('HH:mm'), updatedQuestion),
      })
    })

    dispatch(updateChatDialog({
      conversationId,
      completions: updatedCompletions,
    }))
  }, [
    conversationId,
    editedCompletionId,
    dialogs,
    dispatch,
    updatedQuestion,
  ])

  const saveEditedQuestion = useCallback(async (completionId) => {
    updateDialog()
    setEditedCompletionId(null)
    await editMessage(completionId, updatedQuestion)
    setUpdatedQuestion('')
  }, [
    editMessage,
    updateDialog,
    updatedQuestion,
  ])

  return {
    editedCompletionId,
    setEditingMode,
    resetEditingMode,
    saveEditedQuestion,
    updatedQuestion,
    setUpdatedQuestion,
  }
}
