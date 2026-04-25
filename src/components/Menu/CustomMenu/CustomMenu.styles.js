
import styled from 'styled-components'
import { Menu } from '../Menu'

const StyledMenu = styled(Menu)`
  .ant-dropdown-menu-item {
    padding: 0;
    & > a {
      margin: 0;
    }
    &:hover {
      cursor: pointer;
    } 
    &[aria-disabled='true']:hover {
      cursor: not-allowed;
    }

    &[aria-disabled='true']  div:hover {
      border-left: none;
      color: inherit;
      font-weight: 400;
    }
  }
`

StyledMenu.Item = Menu.Item
StyledMenu.SubMenu = Menu.SubMenu

export {
  StyledMenu,
}
