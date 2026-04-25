
import styled from 'styled-components'
import { Button } from './Button'

const TextButton = styled(Button)`
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  box-shadow: none;
  text-align: left;

  &:disabled,
  &:active,
  &:hover {
    color: ${(props) => props.theme.color.grayscale4};
    background-color: transparent;
  }

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.grayscale5};
  }
`

export {
  TextButton,
}
