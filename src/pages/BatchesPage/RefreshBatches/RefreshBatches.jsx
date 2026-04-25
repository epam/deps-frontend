
import { PropTypes } from 'prop-types'
import { Button } from '@/components/Button'
import { ArrowsRotate } from '@/components/Icons/ArrowsRotate'
import { Tooltip } from '@/components/Tooltip'
import { localize, Localization } from '@/localization/i18n'

export const RefreshBatches = ({ refetch }) => (
  <Tooltip title={localize(Localization.REFRESH_DATA)}>
    <Button.Secondary
      icon={<ArrowsRotate />}
      onClick={refetch}
    />
  </Tooltip>
)

RefreshBatches.propTypes = {
  refetch: PropTypes.func.isRequired,
}
