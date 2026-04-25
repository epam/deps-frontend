
import styled from 'styled-components'
import { Menu } from '@/components/Menu'

const StyledMenu = styled(Menu)`
  border-right: none;  
`

const SidebarMenuItem = styled(Menu.Item)`
  width: 100% !important;
  color: #262d36;
  padding: 0 !important;

  &::after {
    left: 0;
    right: 100% !important;
  }

  &.ant-menu-item-selected  {
    background-color: ${(props) => props.theme.color.primary3} !important;

    &::after {
      opacity: 1 !important;
      transform: none !important;
    }

    svg {
      color: ${(props) => props.theme.color.primary2} !important;
    }
  }

  &:hover {
    background-color: ${(props) => props.theme.color.primary5} !important; 
  }

  & > * {
    vertical-align: middle;
  }
`

const StyledIconWrapper = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

export {
  SidebarMenuItem,
  StyledMenu,
  StyledIconWrapper,
}
