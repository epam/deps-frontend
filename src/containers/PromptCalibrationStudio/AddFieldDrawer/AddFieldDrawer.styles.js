
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'

export const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 1.6rem;
`

export const StyledDrawer = styled(Drawer)`
  z-index: 1001;

  & .ant-drawer-footer {
    padding: 1rem 2.4rem;
  }
    
  .ant-drawer-title {
    color: ${(props) => props.theme.color.grayscale18};
  }
`
