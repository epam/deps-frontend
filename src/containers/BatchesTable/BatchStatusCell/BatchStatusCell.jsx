
import PropTypes from 'prop-types'
import { BatchStatus, RESOURCE_BATCH_STATUS } from '@/enums/BatchStatus'
import { theme } from '@/theme/theme.default'
import { StyledBadge } from './BatchStatusCell.styles'

const BADGE_COLOR_TO_BATCH_STATUS_MAPPING = {
  [BatchStatus.NEW]: theme.color.statusExtraction,
  [BatchStatus.PROCESSING]: theme.color.warning,
  [BatchStatus.CONSOLIDATION]: theme.color.warning,
  [BatchStatus.VALIDATION]: theme.color.warning,
  [BatchStatus.REVIEW]: theme.color.success,
  [BatchStatus.COMPLETED]: theme.color.success,
  [BatchStatus.EXPORTING]: theme.color.grayscale18,
  [BatchStatus.EXPORTED]: theme.color.success,
  [BatchStatus.FAILED]: theme.color.error,
  [BatchStatus.ABORTED]: theme.color.error,
}

const BatchStatusCell = ({ status }) => (
  <StyledBadge
    color={BADGE_COLOR_TO_BATCH_STATUS_MAPPING[status]}
    text={RESOURCE_BATCH_STATUS[status]}
  />
)

BatchStatusCell.propTypes = {
  status: PropTypes.string.isRequired,
}

export {
  BatchStatusCell,
}
