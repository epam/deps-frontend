
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 4px;
`

const SendMessageButton = styled(Button.Icon)`
  color: ${(props) => props.theme.color.primary2};
  width: 3.2rem;
  height: 3.2rem;
  
  &:hover,
  &:focus {
    border: none;
    box-shadow: none;
  }
`

const CancelButton = styled(Button.Icon)`
  color: ${(props) => props.theme.color.grayscale22};
  width: 3.2rem;
  height: 3.2rem;
  
  &:hover,
  &:focus {
    border: none;
    box-shadow: none;
  }
`

const TextArea = styled(Input.TextArea)`
  flex-grow: 1;
`

export {
  CancelButton,
  SendMessageButton,
  TextArea,
  Wrapper,
}
