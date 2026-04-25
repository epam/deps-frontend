
import PropTypes from 'prop-types'
import FileMail from '@/assets/icons/file-mail.svg'

const FileMailIcon = (props) => (
  <FileMail className={props.className} />
)

FileMailIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FileMailIcon,
}
