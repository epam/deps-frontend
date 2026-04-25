
import PropTypes from 'prop-types'
import { pageLayoutShape } from './PageLayout'

class DocumentLayout {
  constructor ({
    id,
    tenantId,
    pages,
  }) {
    this.id = id
    this.tenantId = tenantId
    this.pages = pages
  }
}

const documentLayoutShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  pages: PropTypes.arrayOf(
    pageLayoutShape.isRequired,
  ),
})

export {
  DocumentLayout,
  documentLayoutShape,
}
