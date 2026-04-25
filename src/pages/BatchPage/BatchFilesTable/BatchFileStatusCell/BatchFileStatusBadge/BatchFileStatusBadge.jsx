
import PropTypes from 'prop-types'
import { BatchFileStatus, RESOURCE_BATCH_FILE_STATUS } from '@/enums/BatchFileStatus'
import { theme } from '@/theme/theme.default'
import { StyledBadge } from './BatchFileStatusBadge.styles'

const BADGE_COLOR_TO_BATCH_FILE_STATUS_MAPPING = {
  [BatchFileStatus.NEW]: theme.color.statusExtraction,
  [BatchFileStatus.PROCESSING]: theme.color.warning,
  [BatchFileStatus.REVIEW]: theme.color.success,
  [BatchFileStatus.COMPLETED]: theme.color.success,
  [BatchFileStatus.FAILED]: theme.color.error,
  [BatchFileStatus.ABORTED]: theme.color.error,
  [BatchFileStatus.EXPORTED]: theme.color.success,
}

const BatchFileStatusBadge = ({ status }) => (
  <StyledBadge
    color={BADGE_COLOR_TO_BATCH_FILE_STATUS_MAPPING[status]}
    text={RESOURCE_BATCH_FILE_STATUS[status]}
  />
)

BatchFileStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
}

export {
  BatchFileStatusBadge,
}
