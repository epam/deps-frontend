
import { authenticationProvider } from '@/authentication'
import { Button, ButtonType } from '@/components/Button'
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { localize, Localization } from '@/localization/i18n'
import {
  Container,
  Image,
  Wrapper,
  Text,
  Info,
} from './NoUserOrganisation.styles'

const NoUserOrganisation = () => (
  <Wrapper>
    <ApplicationLogo />
    <Container>
      <Image />
      <Info>
        <Text>
          {localize(Localization.NO_ORGANISATION_INFO)}
        </Text>
        <Button
          onClick={authenticationProvider.signOut}
          type={ButtonType.GHOST}
        >
          {localize(Localization.SIGN_OUT)}
        </Button>
      </Info>
    </Container>
  </Wrapper>
)

export {
  NoUserOrganisation,
}
