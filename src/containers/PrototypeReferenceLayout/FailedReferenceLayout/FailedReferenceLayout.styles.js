
import styled from 'styled-components'
import failedStateImage from '@/assets/images/failedState.png'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding-block: 2rem;
  overflow-y: auto;
`

const Image = styled.div`
  width: 30%; 
  aspect-ratio: 1;
  background-image: url(${failedStateImage});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

const Title = styled.h3`
  width: 90%;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale16};
  margin: 4rem 0 2.4rem;
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
  Wrapper,
  Image,
  Title,
  StyledButton as Button,
}
