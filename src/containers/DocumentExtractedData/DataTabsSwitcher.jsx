
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Button } from '@/components/Button'
import { MoreIcon } from '@/components/Icons/MoreIcon'
import { Input } from '@/components/Input'
import { CustomMenu } from '@/components/Menu/CustomMenu'
import { tabShape } from '@/components/Tabs'
import { localize, Localization } from '@/localization/i18n'

const MAX_MENU_ITEM_RESULTS_QUANTITY = 15

const mapTabsToMenuItems = (tabs, changeActiveTab) => {
  const tabsToRender = [...tabs]

  if (tabsToRender.length > MAX_MENU_ITEM_RESULTS_QUANTITY) {
    tabsToRender.length = MAX_MENU_ITEM_RESULTS_QUANTITY
  }

  return tabsToRender.map((tab) => ({
    content: () => (
      <Button.Text
        onClick={() => changeActiveTab(tab.key)}
      >
        {tab.label}
      </Button.Text>
    ),
  }))
}

const getTitleTextContent = (title) => {
  if (Array.isArray(title)) {
    return title.map((el) => getTitleTextContent(el)).join('')
  }

  if (title?.props?.children) {
    return getTitleTextContent(title.props.children)
  }

  return title
}

const DEFAULT_SEARCH_VALUE = ''
class DataTabsSwitcher extends Component {
  state = {
    menuItems: mapTabsToMenuItems(this.props.tabs, this.props.changeActiveTab),
    searchValue: DEFAULT_SEARCH_VALUE,
  }

  updateMenuItems = (value) => {
    const filteredTabs = this.props.tabs.filter((t) => getTitleTextContent(t.label).toLowerCase().includes(value.toLowerCase()))
    this.setState({
      menuItems: mapTabsToMenuItems(filteredTabs, this.props.changeActiveTab),
      searchValue: value,
    })
  }

  componentDidUpdate = (prevProps) => {
    if (!isEqual(prevProps.tabs, this.props.tabs)) {
      this.setState({
        menuItems: mapTabsToMenuItems(this.props.tabs, this.props.changeActiveTab),
      })
    }
  }

  onChange = (e) => {
    const value = e.target.value

    this.updateMenuItems(value)
  }

  getItems = () => ([
    {
      content: () => (
        <Input
          allowClear
          onChange={this.onChange}
          onPressEnter={this.onChange}
          placeholder={localize(Localization.AUTOCOMPLETE_PLACEHOLDER, { count: this.props.tabs.length })}
          value={this.state.searchValue}
        />
      ),
      style: {
        backgroundColor: 'unset',
      },
      onClick: () => { },
    },
    ...this.state.menuItems,
  ])

  getPopupContainer = (trigger) => trigger.parentNode.parentNode.parentNode.parentNode

  resetMenuItems = (visible) => {
    visible && this.updateMenuItems(DEFAULT_SEARCH_VALUE)
  }

  render = () => (
    <CustomMenu
      getPopupContainer={this.getPopupContainer}
      items={this.getItems()}
      onVisibleChange={this.resetMenuItems}
    >
      <Button.Icon
        icon={<MoreIcon />}
      />
    </CustomMenu>
  )
}

DataTabsSwitcher.propTypes = {
  tabs: PropTypes.arrayOf(tabShape).isRequired,
  changeActiveTab: PropTypes.func.isRequired,
}

export { DataTabsSwitcher }
