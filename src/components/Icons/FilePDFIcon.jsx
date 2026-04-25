
import PropTypes from 'prop-types'
import FilePDF from '@/assets/icons/file-pdf.svg'

const FilePDFIcon = (props) => (
  <FilePDF className={props.className} />
)

FilePDFIcon.propTypes = {
  className: PropTypes.string,
}

export {
  FilePDFIcon,
}
