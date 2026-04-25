
import { Localization, localize } from '@/localization/i18n'
import { ENV } from '@/utils/env'
import {
  Wrapper,
  Image,
  Link,
  Text,
} from './LocalBoundary.styles'

const SUPPORT_EMAIL = `mailto:${ENV.SUPPORT_EMAIL}`

export const LocalBoundary = () => (
  <Wrapper>
    <Image />
    <Text>
      {localize(Localization.DEFAULT_ERROR_MESSAGE)}
    </Text>
    <Text>
      {localize(Localization.PLEASE)}
      <Link href={SUPPORT_EMAIL}>
        {localize(Localization.CONTACT_SUPPORT)}
      </Link>
    </Text>
  </Wrapper>
)
