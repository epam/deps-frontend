
import { LogoIcon } from '@/components/Icons/LogoIcon'
import { navigationMap } from '@/utils/navigationMap'
import { goTo } from '@/utils/routerActions'
import { openInNewTarget } from '@/utils/window'
import { LogoIconWrapper } from './ApplicationLogo.styles'

const ApplicationLogo = () => {
  const onLogoIconClick = (event) => {
    openInNewTarget(
      event,
      navigationMap.home(),
      () => goTo(navigationMap.home()),
    )
  }
  return (
    <LogoIconWrapper>
      <LogoIcon onClick={onLogoIconClick} />
    </LogoIconWrapper>
  )
}

export {
  ApplicationLogo,
}
