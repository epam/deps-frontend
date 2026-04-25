
import { useDispatch } from 'react-redux'
import { goTo } from '@/actions/navigation'
import { Button, ButtonType } from '@/components/Button'
import { ErrorLayout } from '@/components/ErrorLayout'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { Wrapper } from './NotFound.styles'

const NotFound = () => {
  const dispatch = useDispatch()
  const backToHomePage = () => dispatch(goTo(navigationMap.home()))

  return (
    <Wrapper>
      <ErrorLayout
        heading={localize(Localization.NOT_FOUND_HEADING)}
        info={localize(Localization.NOT_FOUND_INFO)}
        statusCode={StatusCode.NOT_FOUND}
      >
        <Button
          onClick={backToHomePage}
          type={ButtonType.GHOST}
        >
          {localize(Localization.GO_HOME_BUTTON_TEXT)}
        </Button>
      </ErrorLayout>
    </Wrapper>
  )
}

export {
  NotFound,
}
