
import { ErrorLayout } from '@/components/ErrorLayout'
import { Layout } from '@/components/Layout'
import { StatusCode } from '@/enums/StatusCode'
import { localize, Localization } from '@/localization/i18n'

const ServiceUnavailable = () => (
  <Layout>
    <ErrorLayout
      heading={localize(Localization.SERVICE_UNAVAILABLE_HEADING)}
      info={localize(Localization.SERVICE_UNAVAILABLE_INFO)}
      statusCode={StatusCode.SERVICE_UNAVAILABLE}
    />
  </Layout>
)

export {
  ServiceUnavailable,
}
