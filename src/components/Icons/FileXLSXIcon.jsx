
import { FileExcelOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const FileXLSXIcon = (props) => (
  <FileExcelOutlined className={props.className} />
)

FileXLSXIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FileXLSXIcon,
}
