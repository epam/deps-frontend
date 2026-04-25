
import PropTypes from 'prop-types'
import FileDOCX from '@/assets/icons/file-docx.svg'

const FileDOCXIcon = (props) => (
  <FileDOCX className={props.className} />
)

FileDOCXIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FileDOCXIcon,
}
