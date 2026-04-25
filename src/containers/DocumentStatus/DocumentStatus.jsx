
import PropTypes from 'prop-types'
import { DocumentState, RESOURCE_DOCUMENT_STATE } from '@/enums/DocumentState'
import { theme } from '@/theme/theme.default'
import { StyledBadge } from './DocumentStatus.styles'

const BADGE_COLOR_TO_DOCUMENT_STATE_MAPPING = {
  [DocumentState.NEW]: theme.color.statusExtraction,
  [DocumentState.UNIFICATION]: theme.color.warning,
  [DocumentState.PREPROCESSING]: theme.color.warning,
  [DocumentState.IDENTIFICATION]: theme.color.warning,
  [DocumentState.VERSION_IDENTIFICATION]: theme.color.versionIdentificationStatus,
  [DocumentState.IMAGE_PREPROCESSING]: theme.color.warning,
  [DocumentState.PARSING]: theme.color.warning,
  [DocumentState.DATA_EXTRACTION]: theme.color.warning,
  [DocumentState.POSTPROCESSING]: theme.color.warning,
  [DocumentState.VALIDATION]: theme.color.warning,
  [DocumentState.NEEDS_REVIEW]: theme.color.success,
  [DocumentState.IN_REVIEW]: theme.color.success,
  [DocumentState.COMPLETED]: theme.color.success,
  [DocumentState.FAILED]: theme.color.error,
  [DocumentState.EXCEPTIONAL_QUEUE]: theme.color.error,
  [DocumentState.EXPORTING]: theme.color.grayscale18,
  [DocumentState.EXPORTED]: theme.color.success,
  [DocumentState.POSTPONED]: theme.color.error,
}

const DocumentStatus = ({
  className,
  status,
}) => (
  <StyledBadge
    className={className}
    color={BADGE_COLOR_TO_DOCUMENT_STATE_MAPPING[status]}
    text={RESOURCE_DOCUMENT_STATE[status]}
  />
)

DocumentStatus.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string.isRequired,
}

export {
  DocumentStatus,
}
