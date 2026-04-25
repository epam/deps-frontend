
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { CustomMenu } from '@/components/Menu/CustomMenu'

const StyledCustomMenu = styled(CustomMenu)`
  width: 20rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 4px;
  box-shadow: 0 0.3rem 1.9rem 0 ${(props) => props.theme.color.shadow3};
  padding: 0;
  
  & > li {
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  }
`

const IconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.2rem;
  margin-left: 1rem;
  flex-shrink: 0;
  font-size: 1.4rem;
  background-color: ${({ $isActive, theme }) => $isActive && theme.color.grayscale20};
  color: ${(props) => props.theme.color.grayscale18};
  
  &:hover,
  &:focus,
  &:active {
    background-color: ${({ $isActive, theme }) => $isActive && theme.color.grayscale20};
    border: none;
    box-shadow: none;
  }
`

export {
  IconButton,
  StyledCustomMenu as CustomMenu,
}
