
import PropTypes from 'prop-types'
import { OutputState } from '@/enums/OutputState'

class Output {
  constructor ({
    id,
    tenantId,
    creationDate,
    profileInfo,
    documentId,
    state,
    filePath,
  }) {
    this.id = id
    this.tenantId = tenantId
    this.creationDate = creationDate
    this.profileInfo = profileInfo
    this.documentId = documentId
    this.state = state
    this.filePath = filePath
  }
}

const outputShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  tenantId: PropTypes.string.isRequired,
  creationDate: PropTypes.string.isRequired,
  profileInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
  }),
  documentId: PropTypes.string.isRequired,
  state: PropTypes.oneOf(
    Object.values(OutputState),
  ).isRequired,
  filePath: PropTypes.string,
})

export {
  Output,
  outputShape,
}
