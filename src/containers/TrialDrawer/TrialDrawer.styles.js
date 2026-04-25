
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper > div {
    padding: 0 1.6rem !important;
  }

  .ant-drawer-footer {
    display: flex;
    justify-content: flex-end;
  }

  .ant-drawer-header,
  .ant-drawer-body,
  .ant-drawer-footer {
    padding-left: 0;
    padding-right: 0;
  }
`

const Title = styled.h4`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale16};
  margin: 0;

  & > svg {
    margin-right: 1rem;
  }
`

export {
  StyledDrawer as Drawer,
  Title,
}
