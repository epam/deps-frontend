
import PropTypes from 'prop-types'
import ViewOfData from '@/assets/icons/ic-32-view-of-data.svg'

const ViewOfDataIcon = (props) => (
  <ViewOfData className={props.className} />
)

ViewOfDataIcon.propTypes = {
  className: PropTypes.string,
}

export {
  ViewOfDataIcon,
}
