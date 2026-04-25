
import { Tooltip } from '@/components/Tooltip'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { batchFileShape } from '@/models/Batch'
import { BatchFileStatusBadge } from './BatchFileStatusBadge'
import { Wrapper, WarningIcon } from './BatchFileStatusCell.styles'

const TEST_ID = {
  WARNING_ICON: 'warning-icon',
}

export const BatchFileStatusCell = ({ file }) => (
  <Wrapper>
    <BatchFileStatusBadge status={file.status} />
    {
      file.error && (
        <Tooltip title={RESOURCE_ERROR_TO_DISPLAY[file.error.code] ?? localize(Localization.DEFAULT_ERROR)}>
          <WarningIcon data-testid={TEST_ID.WARNING_ICON} />
        </Tooltip>
      )
    }
  </Wrapper>
)

BatchFileStatusCell.propTypes = {
  file: batchFileShape.isRequired,
}
