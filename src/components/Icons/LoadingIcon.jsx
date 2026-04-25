
import { LoadingOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const LoadingIcon = (props) => (
  <LoadingOutlined className={props.className} />
)

LoadingIcon.propTypes = {
  className: PropTypes.string,
}

export {
  LoadingIcon,
}
