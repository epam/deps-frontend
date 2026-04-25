
import styled from 'styled-components'
import { Drawer } from '@/components/Drawer'

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    position: relative;
    box-shadow: 0 0.6rem 0.8rem 0 ${(props) => props.theme.color.shadow2};
    z-index: 1;
  }

  .ant-drawer-body {
    padding: 3rem 1.5rem;

    & > div {
      min-height: 10rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .ant-spin {
    width: 100%;
    height: 100%;
  }
`

const Title = styled.h4`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale16};
  margin: 0;
`

export {
  StyledDrawer as Drawer,
  Title,
}
