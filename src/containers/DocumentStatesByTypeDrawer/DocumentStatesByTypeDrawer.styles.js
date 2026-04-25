
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header,
  .ant-drawer-body {
    padding: 1.6rem;
  }
  
  .ant-drawer-title {
    font-size: 1.4rem;
    font-weight: 600;
  }
`

const RedirectButton = styled(Button.Icon)`
  height: 3.2rem;
  width: 3.2rem;
  border: 1px solid ${(props) => props.theme.color.primary2};
`

export {
  StyledDrawer as Drawer,
  RedirectButton,
}
