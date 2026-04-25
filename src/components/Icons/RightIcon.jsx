
import { RightOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const RightIcon = (props) => (
  <RightOutlined className={props.className} />
)

RightIcon.propTypes = {
  className: PropTypes.string,
}

export {
  RightIcon,
}
