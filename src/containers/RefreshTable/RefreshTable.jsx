
import PropTypes from 'prop-types'
import { Button } from '@/components/Button'
import { RefreshIcon } from '@/components/Icons/RefreshIcon'
import { REFRESH_DATA_BUTTON } from '@/constants/automation'
import { Placement } from '@/enums/Placement'
import { localize, Localization } from '@/localization/i18n'

const REFRESH_DATA_TOOLTIP = {
  placement: Placement.TOP,
  title: localize(Localization.REFRESH_DATA),
}

const RefreshTable = ({ refreshTable, ...restProps }) => (
  <Button.Icon
    data-automation={REFRESH_DATA_BUTTON}
    icon={<RefreshIcon />}
    onClick={refreshTable}
    tooltip={REFRESH_DATA_TOOLTIP}
    {...restProps}
  />
)

RefreshTable.propTypes = {
  refreshTable: PropTypes.func.isRequired,
}

export {
  RefreshTable,
}
