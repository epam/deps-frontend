
import { useContext } from 'react'
import { ChatSettingsContext } from '../providers'

export const useChatSettings = () => useContext(ChatSettingsContext)
