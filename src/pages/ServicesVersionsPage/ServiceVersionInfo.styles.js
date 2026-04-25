
import styled from 'styled-components'
import { theme } from '@/theme/theme.default'

const ServiceVersionInfoWrapper = styled.div`
  padding: 1rem 2rem 0;
  border-bottom: 0.3rem solid ${theme.color.primary5};
  :nth-child(1), :nth-child(2) {
    border-top: 0.3rem solid ${theme.color.primary5};
  }
  &:not(:nth-child(2n)) {
    border-right: 0.3rem solid ${theme.color.primary5};
  }
`

const ServiceVersionInfoHeader = styled.h3`
  color: ${theme.color.primary4};
  font-weight: 800;
`

const ServiceVersionInfoContent = styled.p`
  margin-left: 2rem;
  color: ${theme.color.primary4};
`

export {
  ServiceVersionInfoWrapper,
  ServiceVersionInfoHeader,
  ServiceVersionInfoContent,
}
