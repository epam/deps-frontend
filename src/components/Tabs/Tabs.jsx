
import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import { Tabs as AntdTabs } from './Tabs.styles'

class Tab {
  constructor (
    key,
    label,
    children,
    hiddenPane = false,
  ) {
    this.key = key
    this.label = label
    this.children = children
    this.hiddenPane = hiddenPane
  }
}

const tabShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  children: childrenShape,
  hiddenPane: PropTypes.bool.isRequired,
})

const Tabs = ({
  activeKey,
  animated = true,
  className,
  onChange,
  tabs,
  extra,
}) => {
  const visibleTabs = tabs.filter((tab) => !tab.hiddenPane)

  return (
    <AntdTabs
      activeKey={activeKey?.toString()}
      animated={animated}
      className={className}
      items={visibleTabs}
      onChange={onChange}
      tabBarExtraContent={extra}
    />
  )
}

Tabs.propTypes = {
  activeKey: PropTypes.string,
  animated: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(tabShape).isRequired,
  extra: childrenShape,
}

export {
  Tabs,
  Tab,
  tabShape,
}
