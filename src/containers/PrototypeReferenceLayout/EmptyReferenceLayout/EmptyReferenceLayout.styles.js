
import styled from 'styled-components'
import emptyPageImage from '@/assets/images/emptyPage.png'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding-block: 2rem;
`

const Image = styled.div`
  width: 30%;
  aspect-ratio: 1;
  background-image: url(${emptyPageImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h3`
  font-size: clamp(1.6rem, 1.5vw, 2.2rem);
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale16};
  margin-bottom: 2.4rem;
`

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  align-self: center;
  margin: 0 0 1rem 1.6rem;

  & > svg {
    margin-right: 1rem;
  }
`

export {
  StyledButton as Button,
  Wrapper,
  Image,
  ContentWrapper,
  Title,
}
