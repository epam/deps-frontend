
import { slateAttributesShape } from '@/containers/Slate/models'
import { childrenShape } from '@/utils/propTypes'

const Row = ({ attributes, children }) => (
  <tr {...attributes}>{children}</tr>
)

Row.propTypes = {
  attributes: slateAttributesShape,
  children: childrenShape.isRequired,
}

export { Row }
