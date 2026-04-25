
import styled, { css } from 'styled-components'
import { Button } from '@/components/Button'
import { Menu } from '@/components/Menu'

const { Icon } = Button

const DropdownButton = styled(Icon)`
  width: 3.2rem;
  height: 3.2rem;
  margin-right: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.primary2};
  
  & path {
    fill: ${(props) => props.theme.color.primary2};
  }

  &,
  :hover,
  :active,
  :focus {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
`

const StyledMenu = styled(Menu)`
  width: 32rem;
  max-height: 25rem;
  overflow-y: auto;
  padding: 0;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  box-shadow: 0 3px 1.9rem 0 ${(props) => props.theme.color.shadow3};
`

const StyledMenuItem = styled(Menu.Item)`
  height: 4rem;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  color: ${(props) => props.theme.color.grayscale16};

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20};
  }
  
  &:last-child {
    border: none;
  }

  .ant-dropdown-menu-title-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ${(props) => props.$selected && css`
    border-left: 0.3rem solid ${props.theme.color.primary2};
    font-weight: 600;
    padding: 0.5rem 1.2rem 0.5rem 0.9rem;
  `}
`

const MenuItemExtraWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FailedLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 1.2rem;
  color: ${(props) => props.theme.color.error};
  background-color: ${(props) => props.theme.color.errorBg};
  border: 1px solid ${(props) => props.theme.color.error};
  border-radius: 4px;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
`

const DeleteIconButton = styled(Icon)`
  width: 2.4rem;
  height: 2.4rem;
  cursor: pointer;
  color: ${(props) => props.theme.color.grayscale22};
  border: none;

  &:active,
  &:focus,
  &:hover {
    border: none;
    box-shadow: none;
    background-color: inherit;
    color: ${(props) => props.theme.color.primary2};
  }
`

export {
  DropdownButton,
  StyledMenu,
  StyledMenuItem,
  FailedLabel,
  MenuItemExtraWrapper,
  DeleteIconButton,
}
