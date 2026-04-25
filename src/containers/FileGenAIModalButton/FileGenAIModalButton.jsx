
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { MessageIcon } from '@/components/Icons/MessageIcon'
import { Localization, localize } from '@/localization/i18n'

const CHAT_BUTTON_TOOLTIP = {
  title: localize(Localization.OPEN_CHAT),
}

const FileGenAIModalButton = ({
  isModalVisible,
  toggleModal,
}) => {
  const handleClick = () => {
    toggleModal()
  }

  return (
    <Button.Secondary
      aria-label={localize(Localization.OPEN_CHAT)}
      disabled={isModalVisible}
      icon={<MessageIcon />}
      onClick={handleClick}
      tooltip={CHAT_BUTTON_TOOLTIP}
    />
  )
}

FileGenAIModalButton.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
}

export {
  FileGenAIModalButton,
}
