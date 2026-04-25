
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 1.6rem 2.4rem;
    border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
  }
  
  .ant-drawer-body {
    padding: 2rem;
  }

  .ant-drawer-footer {
    padding: 1.6rem 2.4rem;
    border-top: 1px solid ${(props) => props.theme.color.grayscale15};
  }
`

const StyledTitle = styled.div`
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 2.2rem;
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
`

export {
  DrawerFooterWrapper,
  StyledDrawer as Drawer,
  StyledTitle as Title,
}
