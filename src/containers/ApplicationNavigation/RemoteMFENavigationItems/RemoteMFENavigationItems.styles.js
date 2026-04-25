
import styled from 'styled-components'
import { Menu } from '@/components/Menu'

const MenuGroup = styled(Menu.ItemGroup)`
  width: 100%;

  .ant-menu-item-group-title {
    display: none;
  }
`

const IconWrapper = styled.div`
  display: flex !important;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

export {
  MenuGroup,
  IconWrapper,
}
