
import { useSelector } from 'react-redux'
import { QuestionCircleIcon } from '@/components/Icons/QuestionCircleIcon'
import { SidebarMenuItem } from '@/components/Sidebar'
import { UserGuideDownloadButton } from '@/containers/UserGuideDownloadButton'
import { Localization, localize } from '@/localization/i18n'
import { customizationSelector } from '@/selectors/customization'
import { navigationMap } from '@/utils/navigationMap'
import { MenuGroup, IconWrapper } from './HelpGroupNavigationItems.styles'

const HelpGroupNavigationItems = () => {
  const customization = useSelector(customizationSelector)

  const menuItems = [
    ...(
      customization.UserGuideDownloadButton
        ? [{
          path: '',
          title: localize(Localization.USER_GUIDE),
          icon: <UserGuideDownloadButton />,
        }]
        : []
    ),
    {
      path: navigationMap.help(),
      title: localize(Localization.SUPPORT),
      icon: <QuestionCircleIcon />,
    },
  ]

  return (
    <MenuGroup>
      {
        menuItems.map(({ path, icon, title }) => (
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
}

export {
  HelpGroupNavigationItems,
}
