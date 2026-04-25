
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header,
  .ant-drawer-body,
  .ant-drawer-footer {
    padding: 1.6rem;
    border-color: ${(props) => props.theme.color.grayscale15};
  }
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`

export {
  StyledDrawer as Drawer,
  DrawerFooterWrapper,
}
