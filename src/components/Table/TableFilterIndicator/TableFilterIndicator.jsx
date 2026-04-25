
import PropTypes from 'prop-types'
import { Badge } from '@/components/Badge'
import { FilterIcon } from '@/components/Icons/FilterIcon'
import { ComponentSize } from '@/enums/ComponentSize'
import { theme } from '@/theme/theme.default'
import { Wrapper } from './TableFilterIndicator.styles'

const TableFilterIndicator = ({
  active,
  icon,
}) => (
  <Badge
    color={theme.color.error}
    dot={active}
    size={ComponentSize.SMALL}
  >
    <Wrapper $active={active}>
      {icon ?? <FilterIcon />}
    </Wrapper>
  </Badge>
)

TableFilterIndicator.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.element,
}

export {
  TableFilterIndicator,
}
