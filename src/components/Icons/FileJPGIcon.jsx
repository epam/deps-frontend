
import PropTypes from 'prop-types'
import FileJPG from '@/assets/icons/file-jpg.svg'

const FileJPGIcon = (props) => (
  <FileJPG className={props.className} />
)

FileJPGIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FileJPGIcon,
}
