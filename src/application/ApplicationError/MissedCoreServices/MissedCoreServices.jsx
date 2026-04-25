
import { useLocation } from 'react-router-dom'
import { ApplicationLogo } from '@/containers/ApplicationLogo'
import { localize, Localization } from '@/localization/i18n'
import {
  Container,
  Image,
  Wrapper,
  Text,
  Info,
  StyledList,
} from './MissedCoreServices.styles'

export const MissedCoreServices = () => {
  const { state } = useLocation()

  return (
    <Wrapper>
      <ApplicationLogo />
      <Container>
        <Image />
        <Info>
          <Text>
            {localize(Localization.MISSED_CORE_SERVICES_INFO)}
          </Text>
          <Text>
            {
              !!state && (
                <StyledList>
                  {
                    Object.values(state).map((service) => (
                      <li key={service.name}>
                        {service.name}
                      </li>
                    ))
                  }
                </StyledList>
              )
            }
          </Text>
        </Info>
      </Container>
    </Wrapper>
  )
}
