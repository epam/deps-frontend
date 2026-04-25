
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { SidebarMenu, configShape } from '@/components/Sidebar/SidebarMenu'
import { Theme } from '@/enums/Theme'
import { themeShape } from '@/theme/theme.default'
import { StyledSider } from './Sidebar.styles'

const Sidebar = ({
  className,
  theme,
  config,
  onClick,
  selectedKeys,
  collapsed,
  renderExtraItems,
}) => (
  <StyledSider
    _theme={theme}
    className={className}
    collapsed={collapsed}
    collapsedWidth={theme.size.siderCollapsedWidth}
    theme={Theme.LIGHT}
    width={theme.size.siderExpandedWidth}
  >
    <SidebarMenu
      config={config}
      onClick={onClick}
      renderExtraItems={renderExtraItems}
      selectedKeys={selectedKeys}
    />
  </StyledSider>
)

Sidebar.propTypes = {
  theme: themeShape,
  className: PropTypes.string,
  config: configShape,
  onClick: PropTypes.func.isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  collapsed: PropTypes.bool,
  renderExtraItems: PropTypes.func,
}

const SidebarWithTheme = withTheme(Sidebar)

export {
  SidebarWithTheme as Sidebar,
}
