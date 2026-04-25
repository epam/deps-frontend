
import { useCallback, useState } from 'react'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { useChatSettings } from '../hooks'
import { Search } from './ConversationsSearch.styles'

const ConversationsSearch = () => {
  const { filters, setTitleFilter } = useChatSettings()

  const [searchValue, setSearchValue] = useState(filters[AgentConversationsFilterKey.TITLE] || '')

  const onSearch = useCallback((filterValue) => {
    setTitleFilter(filterValue)
    setSearchValue(filterValue)
  }, [setTitleFilter])

  return (
    <Search
      filter={searchValue}
      onChange={onSearch}
    />
  )
}

export {
  ConversationsSearch,
}
