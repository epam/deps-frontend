
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  font-family: 'Open Sans', sans-serif;

  .ant-drawer-content-wrapper > div {
    padding: 0 2rem !important;
  }

  .ant-drawer-header,
  .ant-drawer-body,
  .ant-drawer-footer {
    padding-left: 0;
    padding-right: 0;
  }
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1rem;
`

export {
  StyledDrawer as Drawer,
  DrawerFooterWrapper,
  CancelButton,
}
