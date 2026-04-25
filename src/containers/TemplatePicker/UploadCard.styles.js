
import styled from 'styled-components'
import { TypographyText } from '@/components/TypographyText'

const Wrapper = styled.div`
  display: flex;
  height: 15rem;
  padding: 1.6rem 1.2rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => props.theme.color.grayscale19};
  border-radius: 2.4rem;
  background-color: ${(props) => props.theme.color.primary5};
`

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  padding: 1rem;
  margin-right: 1.2rem;
  border-radius: 50%;
  margin-bottom: 0.8rem;
  background-color: ${(props) => props.theme.color.primary3};
`

const ButtonWrapper = styled.div`
  width: 4.5rem;
  height: 3rem;
`

const CardDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`

const DocumentName = styled.div`
  font-weight: 600;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale13};
`

const DocumentSize = styled.div`
  font-size: 1.2rem;
  line-height: 1.6rem;
  color: ${(props) => props.theme.color.grayscale11};
`

const StyledTypographyText = styled(TypographyText)`
  width: 100%;
  max-width: 18rem !important;
`

export {
  Wrapper,
  IconWrapper,
  ButtonWrapper,
  CardDescription,
  CardInfo,
  DocumentName,
  DocumentSize,
  StyledTypographyText as TypographyText,
}
