
import { SidebarMenuItem } from '@/components/Sidebar'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { ENV } from '@/utils/env'
import { IconWrapper, MenuGroup } from './RemoteMFENavigationItems.styles'

const MFE_PREFIX = 'MFE'

const RemoteMFENavigationItems = () => {
  const remoteMFEs = (
    Object.keys(ENV)
      .filter((key) => key.startsWith(MFE_PREFIX) && ENV[key])
      .map((key) => ENV[key])
  )

  const renderNavItems = (module) => (
    <MenuGroup>
      {
        module.map(({ path, icon, title }) => (
          <SidebarMenuItem
            key={path}
            icon={
              (
                <IconWrapper>
                  {icon}
                </IconWrapper>
              )
            }
            path={path}
          >
            {title}
          </SidebarMenuItem>
        ))
      }
    </MenuGroup>
  )

  return (
    remoteMFEs.map((url) => (
      <ModuleLoader
        key={url}
        url={url}
      >
        {renderNavItems}
      </ModuleLoader>
    ))
  )
}

export {
  RemoteMFENavigationItems,
}
