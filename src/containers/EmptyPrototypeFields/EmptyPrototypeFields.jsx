
import PropTypes from 'prop-types'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Image,
  ContentWrapper,
  Title,
} from './EmptyPrototypeFields.styles'

const EmptyPrototypeFields = ({ renderExtra }) => (
  <Wrapper>
    <Image />
    <ContentWrapper>
      <Title>
        {localize(Localization.EMPTY_SECTION_DISCLAIMER)}
      </Title>
      {renderExtra()}
    </ContentWrapper>
  </Wrapper>
)

EmptyPrototypeFields.propTypes = {
  renderExtra: PropTypes.func.isRequired,
}

export {
  EmptyPrototypeFields,
}
