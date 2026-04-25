
import AntdEmpty from 'antd/es/empty'
import { forwardRef } from 'react'
import 'antd/lib/empty/style/index.less'

const Empty = forwardRef((props, ref) => (
  <div ref={ref}>
    <AntdEmpty {...props} />
  </div>
))

export {
  Empty,
}
