
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Collapse } from '@/components/Collapse'
import { Drawer } from '@/components/Drawer'
import { Form } from '@/components/Form/ReactHookForm'

const StyledDrawer = styled(Drawer)`
  z-index: 1060;

  .ant-drawer-body {
    padding: 1.6rem;
  }

  .ant-drawer-header,
  .ant-drawer-footer {
    padding: 1.6rem 0;
    margin: 0 1.6rem;
  }
`

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`

const StyledCollapse = styled(Collapse)`
  .ant-collapse-header,
  .ant-collapse-content-box {
    padding-left: 0 !important;
  }

  .ant-collapse-header {
    color: ${(props) => props.theme.color.primary2} !important;
  }
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1rem;
`

export {
  StyledDrawer as Drawer,
  StyledForm as Form,
  StyledCollapse as Collapse,
  DrawerFooterWrapper,
  CancelButton,
}
