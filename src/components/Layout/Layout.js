
import AntdLayout from 'antd/es/layout'
import 'antd/lib/layout/style/index.less'
import styled from 'styled-components'

const Layout = styled(AntdLayout)`
  position: relative;
  overflow: hidden;
`

Layout.Content = AntdLayout.Content
Layout.Sider = AntdLayout.Sider

export {
  Layout,
}
