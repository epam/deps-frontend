
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Menu } from '@/components/Menu'
import { FieldValidationType } from '@/models/DocumentValidation'
import { theme } from '@/theme/theme.default'
import '@/containers/ValidationResults/ValidationResults.css'

const MENU_ITEM_HEIGHT = 3.2
const VISIBLE_ITEMS_COUNT = 10
const MAX_HEIGHT = MENU_ITEM_HEIGHT * VISIBLE_ITEMS_COUNT

const hoverStyles = (props) => css`
  :hover,
  :focus,
  :active {
    background-color: ${props.$section === FieldValidationType.WARNINGS ? theme.color.warningBg : theme.color.errorBg};
  }
`

const hoverItemStyles = (props) => !props.$index && props.$index !== 0 && css`
  :hover,
  :focus,
  :active {
    border-left: 4px solid ${props.$section === FieldValidationType.WARNINGS ? theme.color.warning : theme.color.error};
  }
`

const StyledMenu = styled(Menu)`
  max-height: ${MAX_HEIGHT}rem;
  overflow-y: scroll;
`

const StyledMenuItem = styled(Menu.Item)`
  border-left: 4px solid transparent;

  > span {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ${(props) => hoverStyles(props)}
  ${(props) => hoverItemStyles(props)}
`

const MenuItemGroup = styled(Menu.ItemGroup)`
  font-weight: 700;

  .ant-dropdown-menu-item-group-title {
    color: ${theme.color.primary4};
    font-size: 1.2rem;
  }
`

const CountFlag = styled.div`
  display: flex;
  align-items: center;
  height: 1.6rem;
  background: ${theme.color.grayscale1};
  padding: 0.1rem 0.8rem;
  margin-left: 2rem;
  font-size: 1rem;
`

const KeyValueFlag = styled.div`
  color: ${theme.color.grayScale8};
  margin-left: 2rem;
`

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;

  > svg {
    margin-right: 1rem;
  }
`

const SubMenu = styled(Menu.SubMenu)`
  border-left: 4px solid transparent;
  ${(props) => hoverItemStyles(props)}

  .ant-dropdown-menu-submenu-title {
    display: flex;
    align-items: center;

    > svg {
      margin: 0 1rem 0 0;
    }

    ${(props) => hoverStyles(props)}
  }
`

const StyledButton = styled(Button)`
  padding: 0.9rem;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.error};
  border: 1px solid ${(props) => props.theme.color.errorLight};
  background-color: ${(props) => props.theme.color.errorBg2};

  :hover {
    border-color: ${(props) => props.theme.color.error};
    background-color: ${(props) => props.theme.color.errorBg2};
    color: ${(props) => props.theme.color.error};
  }

  :active,
  :focus {
    border-color: ${(props) => props.theme.color.error};
    background-color: ${(props) => props.theme.color.errorLight};
    color: ${(props) => props.theme.color.error};
  }

  :disabled {
    color: ${(props) => props.theme.color.grayscale22};
    border-color: ${(props) => props.theme.color.grayscale1};
    background: ${(props) => props.theme.color.grayscale14};
  }
`

export {
  StyledMenuItem as MenuItem,
  CountFlag,
  KeyValueFlag,
  MenuItemGroup,
  TitleWithIcon,
  SubMenu,
  StyledMenu as Menu,
  StyledButton as Button,
}
