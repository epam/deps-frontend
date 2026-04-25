
import styled from 'styled-components'
import { Menu } from '@/components/Menu'
import { TypographyText } from '@/components/TypographyText'

const StyledSubMenu = styled(Menu.SubMenu)`
  & .ant-zoom-big {
    visibility: hidden;
  }
  
  & .ant-dropdown-menu-submenu > ul {
    max-height: 26rem;
    overflow: auto;
  }

  & > div {
    padding: 1rem 2.4rem 1rem 1rem;
    transition: none;
  }

  &.ant-dropdown-menu-submenu-open > div {
    border-left: 2px solid ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.grayscale5};
    background-color: ${(props) => props.theme.color.grayscale8};
    font-weight: bolder;
  }

  & > svg {
    fill: ${(props) => props.theme.color.primary3};
  }
`

const StyledText = styled.span`
  display: block;
  padding: 1rem 2.4rem 1rem 1rem;
  max-width: 25rem;
  width: 100%;
`

const StyledTypographyText = styled(TypographyText)`
  width: 100%;
  padding: 1rem 2.4rem 1rem 1rem;
  max-width: 25rem !important;
  color: ${(props) => props.theme.color.grayscale5};

  &:hover {
    padding-right: 1.5rem;
    border-left: 2px solid ${(props) => props.theme.color.primary2};
    color: ${(props) => props.theme.color.grayscale5};
    font-weight: bolder;
  }
`

export {
  StyledSubMenu as SubMenu,
  StyledTypographyText as TypographyText,
  StyledText as Text,
}
