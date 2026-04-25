
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'
import { NoData } from '@/components/NoData'

const StyledDrawer = styled(Drawer)`
  & .ant-drawer-header-title {
    flex-direction: row-reverse;

    & > button {
      align-self: end;
    }
  }

  & .ant-drawer-body,
  & .ant-drawer-header {
    padding: 1.6rem;
  }

  & .ant-drawer-body > .ant-spin-spinning {
    display: block;
  }
  
`

const DrawerHeaderWrapper = styled.span`
  font-size: 1.4rem;
  font-weight: 600;
`

const StyledNoData = styled(NoData)`
  top: 10rem;
`

export {
  DrawerHeaderWrapper,
  StyledDrawer as Drawer,
  StyledNoData as NoData,
}
