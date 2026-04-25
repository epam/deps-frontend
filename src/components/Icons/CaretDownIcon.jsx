
import { CaretDownOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const CaretDownIcon = (props) => (
  <CaretDownOutlined className={props.className} />
)

CaretDownIcon.propTypes = {
  className: PropTypes.string,
}

export {
  CaretDownIcon,
}
