
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  & .ant-drawer-header-title {
    flex-direction: row-reverse;

    & > button {
      align-self: end;
    }
  }
`

const DrawerHeaderWrapper = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1rem;
`

const DownloadButton = styled(Button)`
  padding: 0.4rem 2rem;
`

export {
  DrawerHeaderWrapper,
  DrawerFooterWrapper,
  CancelButton,
  DownloadButton,
  StyledDrawer as Drawer,
}
