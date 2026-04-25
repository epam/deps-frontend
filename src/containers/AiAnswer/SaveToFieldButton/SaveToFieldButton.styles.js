
import styled from 'styled-components'
import { IconButton } from '@/components/Button/IconButton'

const StyledIconButton = styled(IconButton)`
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;
  flex: 0 0 auto;
  margin-left: -1.4rem;
  border-radius: 3.2rem;
  color: ${(props) => props.theme.color.primary2};
  background-color: ${(props) => props.theme.color.grayscale20};
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
  StyledIconButton as IconButton,
}
