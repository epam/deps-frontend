
import PropTypes from 'prop-types'
import { useCallback, Fragment } from 'react'
import { FeatureNames } from '@/enums/FeatureNames'
import { isFeatureEnabled } from '@/utils/features'
import { openInNewTarget } from '@/utils/window'
import {
  SidebarMenuItem,
  StyledMenu,
  StyledIconWrapper,
} from './SidebarMenu.styles'

const mapConfigItemToMenuItem = (configItem) => {
  const {
    path,
    icon,
    title,
    devOnly,
  } = configItem

  if (!devOnly || isFeatureEnabled(FeatureNames.SHOW_NOT_IMPLEMENTED)) {
    return (
      <SidebarMenuItem
        key={path}
        icon={
          (
            <StyledIconWrapper>
              {icon}
            </StyledIconWrapper>
          )
        }
        path={path}
      >
        {title}
      </SidebarMenuItem>
    )
  }

  return null
}

const SidebarMenu = ({
  selectedKeys,
  onClick,
  config,
  renderExtraItems,
}) => {
  const onMenuItemClick = useCallback(({ domEvent, key }) => {
    openInNewTarget(domEvent, key, () => onClick(key))
  }, [onClick])

  return (
    <StyledMenu
      mode={'inline'}
      onClick={onMenuItemClick}
      selectedKeys={selectedKeys}
    >
      {
        config.map((section, index) => {
          const MenuItems = section.map(mapConfigItemToMenuItem)

          return (
            <Fragment key={index}>
              {MenuItems}
            </Fragment>
          )
        })
      }
      {renderExtraItems?.()}
    </StyledMenu>
  )
}

const sideBarConfigItemShape = PropTypes.shape({
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  devOnly: PropTypes.bool,
})

const configShape = PropTypes.arrayOf(
  PropTypes.arrayOf(sideBarConfigItemShape),
).isRequired

SidebarMenu.propTypes = {
  onClick: PropTypes.func.isRequired,
  selectedKeys: PropTypes.arrayOf(PropTypes.string),
  config: configShape,
  renderExtraItems: PropTypes.func,
}

export {
  SidebarMenu,
  configShape,
}
