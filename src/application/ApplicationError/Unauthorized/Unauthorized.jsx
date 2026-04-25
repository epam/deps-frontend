
import { authenticationProvider } from '@/authentication'
import { Button, ButtonType } from '@/components/Button'
import { ErrorLayout } from '@/components/ErrorLayout'
import { Layout } from '@/components/Layout'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'

const Unauthorized = () => (
  <Layout>
    <ErrorLayout
      heading={localize(Localization.UNAUTHORIZED_HEADING)}
      info={localize(Localization.UNAUTHORIZED_INFO)}
      statusCode={StatusCode.UNAUTHORIZED}
    >
      <Button
        onClick={authenticationProvider.signIn}
        type={ButtonType.GHOST}
      >
        {localize(Localization.GO_TO_LOGIN_PAGE)}
      </Button>
    </ErrorLayout>
  </Layout>
)

export {
  Unauthorized,
}
