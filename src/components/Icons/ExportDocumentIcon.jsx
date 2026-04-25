
import IconSource from '@/assets/icons/export-document.svg'
import { IconsShape } from './Icons'
import { Icon } from './Icons.styles'

const ExportDocumentIcon = ({ className, ...rest }) => (
  <Icon
    {...rest}
  >
    <IconSource className={className} />
  </Icon>
)

ExportDocumentIcon.propTypes = IconsShape

export {
  ExportDocumentIcon,
}
