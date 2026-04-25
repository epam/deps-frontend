
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { CustomMenu } from '@/components/Menu/CustomMenu'

const MenuDropdownStyle = (props) => `
  min-width: 20rem;
  border: 1px solid ${props.theme.color.grayscale1};
  box-shadow: 0 3px 1.9rem 0 ${props.theme.color.shadow3};
  padding: 0;
`

const StyledMenu = styled(CustomMenu)`
  ${(props) => MenuDropdownStyle(props)}
  
  .ant-dropdown-menu-sub {
    ${(props) => MenuDropdownStyle(props)}
    margin: 0;
  }

  .ant-dropdown-menu-submenu,
  .ant-dropdown-menu-item {
    height: 4rem;
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  }

  .ant-dropdown-menu-submenu:hover,
  .ant-dropdown-menu-item:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
  
  .ant-dropdown-menu-submenu-title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 0;
    color: ${(props) => props.theme.color.grayscale16};
  }

  .ant-dropdown-menu-submenu-title:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
  
  .ant-dropdown-menu-title-content {
    height: 100%;

    & > span {
      display: block;
      height: 100%;
    }
  }
`

const StyledButton = styled(Button.Secondary)`
  flex-shrink: 0;
`

const MenuItemButton = styled(Button.Text)`
  padding-left: 1.2rem;
  height: 100%;
  color: ${(props) => props.theme.color.grayscale16};
  
  ${(props) => props.disabled && css`
    &&, &&:hover {
      background: ${props.theme.color.primary3};
      color: ${(props) => props.theme.color.grayscale22};
    }
  `}
`

export {
  MenuItemButton,
  StyledButton as Button,
  StyledMenu as Menu,
}
