
import styled from 'styled-components'
import { Button } from '@/components/Button'

const MenuItemButton = styled(Button.Text)`
  height: 4rem;
  padding: 0.8rem 1.2rem;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  
  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }

  &:focus,
  &:active {
    color: ${(props) => props.theme.color.grayscale18};
  }
`

export {
  MenuItemButton,
}
