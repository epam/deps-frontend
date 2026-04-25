
import styled from 'styled-components'
import { Button } from '@/components/Button'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2rem;
  padding: 3.2rem 1.2rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale20};
  border: 1px solid ${(props) => props.theme.color.grayscale19};
`

const Image = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6.4rem;
  width: 6.4rem;
  padding: 1rem;
  border-radius: 8.8rem;
  background-color: ${(props) => props.theme.color.primary3};
  box-shadow: 0 3px 1.9rem 0 ${(props) => props.theme.color.shadow3};
  color: ${(props) => props.theme.color.primary2};
  font-weight: 900;
  font-size: 2.4rem;
  line-height: 4.8rem;
`

const Title = styled.div`
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale16};
`

const ChangeButton = styled(Button)`
  height: 2.4rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.6rem;
  background-color: transparent;
  color: ${(props) => props.theme.color.primary2};
  border: none;
  box-shadow: none;

  &&:hover,
  &&:focus {
    border: none;
    box-shadow: none;
    background-color: transparent;
    color: ${(props) => props.theme.color.primary2};
  }
`

export {
  ChangeButton,
  Image,
  Title,
  Wrapper,
}
