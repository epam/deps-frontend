
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { connect } from 'react-redux'
import {
  changeActiveTab,
  changeFieldsGrouping,
} from '@/actions/documentReviewPage'
import { Button } from '@/components/Button'
import { Dropdown } from '@/components/Dropdown'
import { ViewOfDataIcon } from '@/components/Icons/ViewOfDataIcon'
import { MenuTrigger, Menu } from '@/components/Menu'
import { GROUPING_TYPE } from '@/enums/GroupingTypeTabs'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'
import { fieldsGroupingSelector } from '@/selectors/documentReviewPage'
import { MenuItem } from './ViewSwitcher.styles'

const GROUPING_TYPE_TO_MENU_TITLE = {
  [GROUPING_TYPE.BY_PAGE]: localize(Localization.VIEW_PAGES),
  [GROUPING_TYPE.USER_DEFINED]: localize(Localization.VIEW_GROUP),
  [GROUPING_TYPE.SET_INDEX]: localize(Localization.VIEW_SETS),
}

const CHANGE_VIEW_TOOLTIP = {
  placement: Placement.TOP_LEFT,
  title: localize(Localization.CHANGE_VIEW),
}

const ViewSwitcher = ({
  changeActiveTab,
  changeFieldsGrouping,
  fieldsGrouping,
}) => {
  const changeView = useCallback(
    (item) => {
      changeFieldsGrouping(item.key)
      changeActiveTab(null)
    },
    [changeFieldsGrouping, changeActiveTab],
  )

  const renderMenu = useCallback(
    () => (
      <Menu
        onClick={changeView}
        selectable
        trigger={MenuTrigger.CLICK}
      >
        {
          Object.entries(GROUPING_TYPE_TO_MENU_TITLE).map(([key, title]) => (
            <MenuItem
              key={key}
              $selected={fieldsGrouping === key}
              id={key}
            >
              {title}
            </MenuItem>
          ))
        }
      </Menu>
    ),
    [changeView, fieldsGrouping],
  )

  return (
    <Dropdown
      dropdownRender={renderMenu}
    >
      <Button.Icon
        icon={<ViewOfDataIcon />}
        tooltip={CHANGE_VIEW_TOOLTIP}
      />
    </Dropdown>
  )
}

ViewSwitcher.propTypes = {
  changeFieldsGrouping: PropTypes.func.isRequired,
  changeActiveTab: PropTypes.func.isRequired,
  fieldsGrouping: PropTypes.oneOf(
    Object.values(GROUPING_TYPE),
  ),
}

const mapStateToProps = (state) => ({
  fieldsGrouping: fieldsGroupingSelector(state),
})

const ConnectedComponent = connect(mapStateToProps, {
  changeActiveTab,
  changeFieldsGrouping,
})(ViewSwitcher)

export {
  ConnectedComponent as ViewSwitcher,
}
