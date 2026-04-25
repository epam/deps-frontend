
import PropTypes from 'prop-types'
import FileImage from '@/assets/icons/file-image.svg'

const FileImageIcon = (props) => (
  <FileImage className={props.className} />
)

FileImageIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FileImageIcon,
}
