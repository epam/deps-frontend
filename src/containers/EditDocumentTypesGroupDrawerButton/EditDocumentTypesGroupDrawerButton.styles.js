
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 0 1.6rem;
    border-color: ${(props) => props.theme.color.grayscale15};
  }
  
  .ant-drawer-title {
    padding: 1.6rem 0;
    color: ${(props) => props.theme.color.grayscale18};
  }
  
  .ant-drawer-body {
    padding: 1.6rem 1.6rem 0;
  }

  .ant-drawer-footer {
    padding: 1.6rem;
    border: none;
    border-top: 1px solid ${(props) => props.theme.color.grayscale15};
  }

  & .ant-drawer-header-title {
    flex-direction: row-reverse;
  }
  
  & .ant-drawer-close {
    margin: 0;
  }
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: auto;
`

export {
  CancelButton,
  DrawerFooterWrapper,
  StyledDrawer as Drawer,
}
