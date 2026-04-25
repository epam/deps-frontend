
import { ErrorLayout } from '@/components/ErrorLayout'
import { Layout } from '@/components/Layout'
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'

const OrganisationSettingsFailure = () => (
  <Layout>
    <ErrorLayout
      heading={localize(Localization.FALLBACK_HEADING)}
      info={localize(Localization.APPLYING_ORGANISATION_SETTINGS_FAILURE, { supportEmail: ENV.SUPPORT_EMAIL })}
    />
  </Layout>
)

export {
  OrganisationSettingsFailure,
}
