
import { InfoCircleFilled } from '@ant-design/icons/lib/icons'
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { NewPlusIcon } from '@/components/Icons/NewPlusIcon'

const StyledDrawer = styled(Drawer)`
  font-family: 'Open Sans', sans-serif;

  .ant-drawer-content-wrapper > div {
    padding: 0 2rem !important;
  }

  .ant-drawer-header,
  .ant-drawer-body,
  .ant-drawer-footer {
    padding-left: 0;
    padding-right: 0;
  }
`

const StyledInfoIcon = styled(InfoCircleFilled)`
  margin-right: 1rem;
  color: ${(props) => props.theme.color.grayscale5};
`

const DrawerHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.color.primary2}; 
  svg {
    margin-right: 0.6rem;
    path {
      fill: ${(props) => props.theme.color.primary2};
    }
  }
`

const DrawerFooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const CancelButton = styled(Button.Secondary)`
  margin-right: 1rem;
`

const DrawerButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 23.6rem;
  font-weight: 600;
`

const Icon = styled(NewPlusIcon)`
  margin-right: 1rem;
`

export {
  StyledInfoIcon as InfoIcon,
  StyledDrawer as Drawer,
  DrawerHeaderWrapper,
  Icon as PlusIcon,
  DrawerButton,
  DrawerFooterWrapper,
  CancelButton,
}
