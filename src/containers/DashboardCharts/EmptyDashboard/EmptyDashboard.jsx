
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Image,
  ContentWrapper,
  Title,
} from './EmptyDashboard.styles.js'

const EmptyDashboard = () => (
  <Wrapper>
    <Image />
    <ContentWrapper>
      <Title>
        {localize(Localization.EMPTY_DASHBOARD_TITLE)}
      </Title>
      <div>{localize(Localization.EMPTY_DASHBOARD_CONTENT_1)}</div>
      <div>{localize(Localization.EMPTY_DASHBOARD_CONTENT_2)}</div>
    </ContentWrapper>
  </Wrapper>
)

export {
  EmptyDashboard,
}
