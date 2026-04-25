
import { Button, ButtonType } from '@/components/Button'
import { ErrorLayout } from '@/components/ErrorLayout'
import { Layout } from '@/components/Layout'
import { localize, Localization } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'

const ErrorFallback = () => {
  const backToHomePage = () => window.location.replace(navigationMap.home())

  return (
    <Layout>
      <ErrorLayout
        heading={localize(Localization.FALLBACK_HEADING)}
        info={localize(Localization.FALLBACK_INFO)}
      >
        <Button
          onClick={backToHomePage}
          type={ButtonType.GHOST}
        >
          {localize(Localization.FALLBACK_ACTION_BUTTON_TEXT)}
        </Button>
      </ErrorLayout>
    </Layout>
  )
}

export {
  ErrorFallback,
}
