
import { LeftOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const LeftIcon = (props) => (
  <LeftOutlined className={props.className} />
)

LeftIcon.propTypes = {
  className: PropTypes.string,
}

export {
  LeftIcon,
}
