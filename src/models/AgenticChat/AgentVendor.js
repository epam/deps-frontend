
import PropTypes from 'prop-types'

class AgentVendor {
  constructor ({
    id,
    name,
    description,
    active,
    avatarUrl,
    connectionParameters,
  }) {
    this.id = id
    this.name = name
    this.description = description
    this.active = active
    this.avatarUrl = avatarUrl
    this.connectionParameters = connectionParameters
  }
}

const agentVendorShape = PropTypes.exact({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  connectionParameters: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
  }).isRequired,
})

export {
  AgentVendor,
  agentVendorShape,
}
