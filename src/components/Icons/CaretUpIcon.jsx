
import { CaretUpOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const CaretUpIcon = (props) => (
  <CaretUpOutlined className={props.className} />
)

CaretUpIcon.propTypes = {
  className: PropTypes.string,
}

export {
  CaretUpIcon,
}
