import { useSelector } from 'react-redux'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Tooltip } from '@/components/Tooltip'
import { ModuleLoader } from '@/containers/ModuleLoader'
import { Placement } from '@/enums/Placement'
import { Localization, localize } from '@/localization/i18n'
import { userSelector } from '@/selectors/authorization'
import { customizationSelector } from '@/selectors/customization'
import { Wrapper } from './GlobaMenu.styles'

const GlobalMenu = () => {
  const customization = useSelector(customizationSelector)
  const user = useSelector(userSelector)

  if (customization.GlobalMenu) {
    return (
      <ErrorBoundary
        localBoundary={() => null}
      >
        <Wrapper>
          <ModuleLoader
            url={
              customization.GlobalMenu.getUrl(
                user.organisation.customizationUrl ||
                user.defaultCustomizationUrl,
              )
            }
          >
            {
              (GlobalMenu) => (
                <Tooltip
                  placement={Placement.BOTTOM}
                  title={localize(Localization.GLOBAL_MENU_TOOLTIP)}
                >
                  <GlobalMenu />
                </Tooltip>
              )
            }
          </ModuleLoader>
        </Wrapper>
      </ErrorBoundary>
    )
  }

  return null
}

export {
  GlobalMenu,
}
