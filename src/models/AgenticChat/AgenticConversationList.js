
import PropTypes from 'prop-types'

class ConversationsListItem {
  constructor ({
    id,
    agentVendorId,
    mode,
    relation,
    title,
  }) {
    this.id = id
    this.agentVendorId = agentVendorId
    this.mode = mode
    this.title = title
    this.relation = relation
  }
}

const documentRelationShape = PropTypes.shape({
  documentId: PropTypes.string.isRequired,
})

const modeShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
})

const conversationsListItemShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  agentVendorId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mode: modeShape.isRequired,
  relation: PropTypes.shape({
    details: PropTypes.oneOfType([
      documentRelationShape,
      PropTypes.object,
    ]).isRequired,
  }),
})

export {
  ConversationsListItem,
  conversationsListItemShape,
}
