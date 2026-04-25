
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { Button, ButtonType } from '@/components/Button'
import { ErrorLayout } from '@/components/ErrorLayout'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { goBack } from '@/utils/routerActions'
import { RetryButton, Wrapper } from './PermissionDeniedPage.styles'

const PermissionDeniedPage = () => {
  const dispatch = useDispatch()
  const backToHomePage = () => dispatch(goTo(navigationMap.home()))

  return (
    <ErrorLayout
      heading={localize(Localization.FORBIDDEN)}
      info={localize(Localization.DOCUMENT_FORBIDDEN_INFO)}
      statusCode={StatusCode.FORBIDDEN}
    >
      <Wrapper>
        <Button
          onClick={backToHomePage}
          type={ButtonType.GHOST}
        >
          {localize(Localization.GO_HOME_BUTTON_TEXT)}
        </Button>
        <RetryButton
          onClick={goBack}
          type={ButtonType.GHOST}
        >
          {localize(Localization.TRY_AGAIN)}
        </RetryButton>
      </Wrapper>
    </ErrorLayout>
  )
}

export {
  PermissionDeniedPage,
}
