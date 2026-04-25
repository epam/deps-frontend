
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 0 3.2rem;
    border: none;
  }
  
  .ant-drawer-body {
    padding: 0 3.2rem;
  }

  .ant-drawer-footer {
    padding: 1.6rem 3.2rem 4rem;
    border: none;
  }
`

const OutputProfileWrapper = styled.div`
  width: 100%;
  margin-top: 2.4rem;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.primary3};
`

const StyledTitle = styled.div`
  padding: 3.2rem 0 1.6rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale16};
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale15};
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1.6rem;
`

export {
  OutputProfileWrapper,
  CancelButton,
  DrawerFooterWrapper,
  StyledDrawer as Drawer,
  StyledTitle as Title,
}
