
import PropTypes from 'prop-types'
import { ReadOnlyViewHeader } from '../ReadOnlyViewHeader'
import { TitleInput } from './ChatHeaderExpanded.styles'

const ChatHeaderExpanded = ({
  activeConversationId,
  isConversationFromDifferentDocument,
  initialTitle,
  onTitleChange,
}) => {
  if (isConversationFromDifferentDocument) {
    return <ReadOnlyViewHeader />
  }

  if (!activeConversationId) {
    return (
      <TitleInput
        initialTitle={initialTitle}
        setTitle={onTitleChange}
      />
    )
  }

  return null
}

ChatHeaderExpanded.propTypes = {
  activeConversationId: PropTypes.string,
  initialTitle: PropTypes.string.isRequired,
  isConversationFromDifferentDocument: PropTypes.bool.isRequired,
  onTitleChange: PropTypes.func.isRequired,
}

export {
  ChatHeaderExpanded,
}
