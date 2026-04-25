
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { LongText } from '@/components/LongText'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { useChatSettings } from '../hooks'
import {
  Icon,
  Link,
  Text,
  Wrapper,
} from './ReadOnlyViewHeader.styles'

const ReadOnlyViewHeader = () => {
  const dispatch = useDispatch()
  const { activeDocumentData, closeModal } = useChatSettings()

  if (!activeDocumentData) {
    return null
  }

  const handleClick = () => {
    const url = navigationMap.documents.document(activeDocumentData.documentId)
    closeModal()
    dispatch(goTo(url))
  }

  return (
    <Wrapper>
      <Icon />
      <Text>{localize(Localization.AGENTIC_CHAT_READONLY_MESSAGE)}</Text>
      <Link onClick={handleClick}>
        <LongText text={activeDocumentData.title} />
      </Link>
    </Wrapper>
  )
}

export {
  ReadOnlyViewHeader,
}
