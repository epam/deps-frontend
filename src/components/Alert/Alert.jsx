
import { Alert as AntdAlert } from 'antd/es'
import 'antd/lib/alert/style/index.less'

const AlertType = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
}

const Alert = (props) => (
  <AntdAlert
    {...props}
  />
)

export {
  Alert,
  AlertType,
}
