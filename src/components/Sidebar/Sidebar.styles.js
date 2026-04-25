
import styled from 'styled-components'
import { Layout } from '@/components/Layout'

const StyledSider = styled(Layout.Sider)`
  box-shadow: 0 1.5rem 1.9rem ${(props) => props._theme.color.grayscale1};
  padding-top: 1.5rem;

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }  
  
  .ant-layout-sider-trigger {
    z-index: 0;
  }

  .ant-menu-item-divider {
    margin: 0 !important;
  }
`

export {
  StyledSider,
}
