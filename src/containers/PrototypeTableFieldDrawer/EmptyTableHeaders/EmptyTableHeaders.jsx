
import { Localization, localize } from '@/localization/i18n'
import {
  ContentWrapper,
  Image,
  Title,
  Wrapper,
} from './EmptyTableHeaders.styles'

const EmptyTableHeaders = () => (
  <Wrapper>
    <Image />
    <ContentWrapper>
      <Title>
        {localize(Localization.EMPTY_SECTION_DISCLAIMER)}
      </Title>
      <Title>
        {localize(Localization.ADD_TABLE_ELEMENT_DESCRIPTION)}
      </Title>
    </ContentWrapper>
  </Wrapper>
)

export {
  EmptyTableHeaders,
}
