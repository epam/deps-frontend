
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { DotsVerticalIcon } from '@/components/Icons/DotsVerticalIcon'
import { Localization, localize } from '@/localization/i18n'
import { DeleteConversationButton } from '../DeleteConversationButton'
import { RenameConversationButton } from '../RenameConversationButton'
import { MenuItemTrigger } from './MenuItemTrigger'
import {
  CustomMenu,
  IconButton,
} from './MoreConversationActions.styles'

const MoreConversationActions = ({
  conversationId,
  conversationTitle,
  nextConversationId,
  hideMoreActions,
  isActive,
  onAfterDelete,
  onAfterRename,
}) => {
  const createMenuItemTrigger = useCallback((label) => (props) => (
    <MenuItemTrigger
      label={label}
      {...props}
    />
  ), [])

  const menuItems = useMemo(() => [
    {
      content: () => (
        <RenameConversationButton
          conversationId={conversationId}
          conversationTitle={conversationTitle}
          onAfterClose={hideMoreActions}
          onAfterRename={onAfterRename}
          renderTrigger={createMenuItemTrigger(localize(Localization.RENAME))}
        />
      ),
      onKeyDown: (e) => e.stopPropagation(),
    },
    {
      content: () => (
        <DeleteConversationButton
          conversationId={conversationId}
          conversationTitle={conversationTitle}
          nextConversationId={nextConversationId}
          onAfterDelete={onAfterDelete}
          renderTrigger={createMenuItemTrigger(localize(Localization.DELETE))}
        />
      ),
    },
  ], [
    conversationId,
    conversationTitle,
    createMenuItemTrigger,
    nextConversationId,
    hideMoreActions,
    onAfterDelete,
    onAfterRename,
  ])

  return (
    <CustomMenu
      items={menuItems}
    >
      <IconButton
        $isActive={isActive}
        icon={<DotsVerticalIcon />}
      />
    </CustomMenu>
  )
}

MoreConversationActions.propTypes = {
  conversationId: PropTypes.string.isRequired,
  conversationTitle: PropTypes.string.isRequired,
  nextConversationId: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  hideMoreActions: PropTypes.func.isRequired,
  onAfterDelete: PropTypes.func.isRequired,
  onAfterRename: PropTypes.func.isRequired,
}

export {
  MoreConversationActions,
}
