
import styled, { css } from 'styled-components'
import { ArrowRightOutlined } from '@/components/Icons/ArrowRightOutlined'
import { Menu } from '@/components/Menu'

export const CustomSubMenu = styled(Menu.SubMenu)`
  .ant-dropdown-menu-submenu-title {
    display: flex !important;
    align-items: center;
    padding-right: 1.2rem !important;
  }

  .ant-dropdown-menu-submenu-expand-icon {
    display: none !important;
  }
`

export const ArrowIcon = styled(ArrowRightOutlined)`
  color: ${({ theme }) => theme.color.grayscale18};
  align-self: center;

  ${(props) => props.$disabled && css`
    color: ${(props) => props.theme.color.grayscale4};
  `}
`

export const Title = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  gap: 1.2rem;
`

export const MenuItem = styled(Menu.Item)`
  padding: 0.5rem 1rem !important;

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale20} !important;
  }
`
