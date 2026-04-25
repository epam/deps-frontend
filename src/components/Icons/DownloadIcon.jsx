
import PropTypes from 'prop-types'
import Download from '@/assets/icons/ic-32-download.svg'
import { Icon } from './Icons.styles'

const DownloadIcon = (props) => (
  <Icon>
    <Download className={props.className} />
  </Icon>
)

DownloadIcon.propTypes = {
  className: PropTypes.string,
}

export {
  DownloadIcon,
}
