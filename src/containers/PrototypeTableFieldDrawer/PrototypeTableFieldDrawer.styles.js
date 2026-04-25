
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 0 1.6rem;
    border: none;
  }
  
  .ant-drawer-body {
    padding: 2rem 1.6rem 0;
    overflow: hidden;
  }

  .ant-drawer-footer {
    padding: 1.6rem;
    border: none;
    box-shadow: 0 -0.3rem 0.6rem 0 ${(props) => props.theme.color.shadow2};
  }

  & .ant-drawer-header-title {
    flex-direction: row-reverse;

    & > button {
      align-self: end;
    }
  }
`

const StyledTitle = styled.div`
  padding: 1.6rem 0;
  font-size: 1.4rem;
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
  CancelButton,
  DrawerFooterWrapper,
  StyledDrawer as Drawer,
  StyledTitle as Title,
}
