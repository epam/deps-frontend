
import styled from 'styled-components'
import { Drawer as DrawerComponent } from '@/components/Drawer'

const Drawer = styled(DrawerComponent)`
  position: absolute;

  .ant-drawer-header {
    height: 4.4rem;
    padding: 0.7rem 1.5rem;
  }

  .ant-drawer-body {
    padding: 1.2rem 1.5rem;
  }
`

const TitleDrawer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  color: ${(props) => props.theme.color.primary2};
  font-size: 1.4rem;
  font-weight: 600;
  svg {
    path {
      fill: ${(props) => props.theme.color.primary2};
      stroke: ${(props) => props.theme.color.primary2};
    }
  }
`

const Wrapper = styled.div`
  padding-bottom: 0.5rem;
`

export {
  TitleDrawer,
  Wrapper,
  Drawer,
}
