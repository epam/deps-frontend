
import Drawer from 'antd/es/drawer'
import 'antd/lib/drawer/style/index.less'
import styled from 'styled-components'

const StyledDrawer = styled(Drawer)`
  position: fixed;

  .ant-drawer-title {
    font-size: 1.4rem;
    font-weight: 600;
  }
`

export {
  StyledDrawer,
}
