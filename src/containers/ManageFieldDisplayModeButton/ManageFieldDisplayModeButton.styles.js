
import styled from 'styled-components'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 1.6rem;
  }

  .ant-drawer-header,
  .ant-drawer-footer {
    padding: 1.6rem 0;
    margin: 0 1.6rem;
  }
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1rem;
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const OpenDrawerButton = styled(Button.Icon)`
  padding: 0.6rem;
  border: 1px solid ${(props) => props.theme.color.primary2};
  border-radius: 50%;

  svg {
    path {
      fill: ${(props) => props.theme.color.primary2};
    }
  }
`

const DisplayModeIndicator = styled(Badge)`
  cursor: pointer;
  
  .ant-badge-dot {
    width: 1rem;
    height: 1rem;
  }
`

export {
  StyledDrawer as Drawer,
  CancelButton,
  DrawerFooterWrapper,
  OpenDrawerButton,
  DisplayModeIndicator,
}
