
import styled from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'

const ActionIcon = styled(IconButton)`
  width: 4rem;
  height: 2.4rem;
  cursor: pointer;
  border-radius: 3.2rem;
  padding: 0.4rem 1.5rem;
  background-color: ${(props) => props.theme.color.grayscale20};
  color: ${(props) => props.theme.color.grayscale11};
  border: none;

  &:active,
  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

export {
  ActionIcon,
}
