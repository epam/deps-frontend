
import AntdCol from 'antd/es/col'
import AntdRow from 'antd/es/row'
import 'antd/lib/grid/style/index.less'

const Grid = {
  Column: (props) => (<AntdCol {...props} />),
  Row: (props) => (<AntdRow {...props} />),
}
export {
  Grid,
}
