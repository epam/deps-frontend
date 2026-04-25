
import PropTypes from 'prop-types'
import { useCallback, useMemo } from 'react'
import { ActionsMenu } from '@/containers/ActionsMenu'
import { AddBusinessRule } from '@/containers/AddBusinessRule'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'

const MoreFieldsActions = ({
  disabled,
}) => {
  const renderAddBusinessRuleItem = useCallback(({ onClick, disabled }) => (
    <ActionsMenu.ItemButton
      disabled={disabled}
      onClick={onClick}
    >
      {localize(Localization.ADD_BUSINESS_RULE)}
    </ActionsMenu.ItemButton>
  ), [])

  const menuItems = useMemo(() => {
    const items = []

    if (ENV.FEATURE_VALIDATION_BUSINESS_RULES) {
      items.push({
        content: () => (
          <AddBusinessRule
            renderTrigger={renderAddBusinessRuleItem}
          />
        ),
        onKeyDown: (e) => e.stopPropagation(),
      })
    }

    return items
  }, [renderAddBusinessRuleItem])

  if (!menuItems.length) {
    return null
  }

  return (
    <ActionsMenu
      disabled={disabled}
      items={menuItems}
    />
  )
}

MoreFieldsActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
}

export {
  MoreFieldsActions,
}
