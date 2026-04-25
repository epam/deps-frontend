
import styled from 'styled-components'
import { Spin } from '@/components/Spin'
import { theme } from '@/theme/theme.default'

const ServicesVersionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 0.2rem;
  height: 100%;
  background-color: ${theme.color.primary5};
`

const ServicesVersionsHeader = styled.div`
  padding: 0.8rem 1.6rem 0.8rem 1.2rem;
  background-color: ${theme.color.primary3};
`

const ServicesVersionsContentWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column; 
  width: 120rem;
  margin: 2rem auto;
  padding: 1rem;
  background-color: ${theme.color.primary3};
  height: 100%;
  overflow-y: auto;
`

const ServicesVersionsContent = styled.div`
  display: grid;
  grid-template: 1fr/ repeat(2, 1fr);
  grid-auto-rows: 1fr;
`

const ServicesVersionsContentHeader = styled.h1`
  margin: 1rem 0.5rem 2rem;
  text-align: center;
  color: ${theme.color.primary4};
`

const LocalBoundary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 0.3rem solid ${theme.color.primary5};
  &:not(:nth-child(2n)) {
    border-right: 0.3rem solid ${theme.color.primary5};
  }
`
const LocalBoundaryText = styled.p`
  font-size: 1.6rem;
  text-align: center;
`

const StyledSpinner = styled(Spin.Centered)`
  flex: 1 1 auto;
`

const Line = styled.div`
  width: 100%;
  min-height: 0.3rem;
  background-color: ${(props) => props.theme.color.grayscale1Darker};
  margin: 4rem 0;
`

const Link = styled.a`
  font-size: 1.6rem;
  color: ${(props) => props.theme.color.primary2};
  text-decoration: none;
  margin-inline: 0.5rem;
`

export {
  StyledSpinner as Spin,
  ServicesVersionsWrapper,
  ServicesVersionsHeader,
  ServicesVersionsContentWrapper,
  ServicesVersionsContent,
  ServicesVersionsContentHeader,
  LocalBoundary,
  LocalBoundaryText,
  Line,
  Link,
}
