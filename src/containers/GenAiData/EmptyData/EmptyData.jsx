
import PropTypes from 'prop-types'
import { ButtonType } from '@/components/Button'
import { MessageIcon } from '@/components/Icons/MessageIcon'
import { Localization, localize } from '@/localization/i18n'
import {
  Wrapper,
  Image,
  ContentWrapper,
  Title,
  Button,
} from './EmptyData.styles'

const EmptyData = ({ onClick }) => (
  <Wrapper>
    <Image />
    <ContentWrapper>
      <Title>
        {localize(Localization.EMPTY_SECTION_DISCLAIMER)}
      </Title>
      <Button
        onClick={onClick}
        type={ButtonType.PRIMARY}
      >
        <MessageIcon />
        {localize(Localization.OPEN_CHAT)}
      </Button>
    </ContentWrapper>
  </Wrapper>
)

EmptyData.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export {
  EmptyData,
}
