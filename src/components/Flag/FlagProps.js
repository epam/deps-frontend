
import PropTypes from 'prop-types'
import { Placement } from '@/enums/Placement'
import { FlagType } from './FlagType'

class FlagProps {
  constructor (
    symbol,
    type,
    title,
    tooltipPlacement,
    onClick,
  ) {
    this.title = title
    this.type = type
    this.symbol = symbol
    this.tooltipPlacement = tooltipPlacement
    this.onClick = onClick
  }
}

const flagShape = PropTypes.shape({
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]).isRequired,
  type: PropTypes.oneOf(
    Object.values(FlagType),
  ).isRequired,
  symbol: PropTypes.string.isRequired,
  tooltipPlacement: PropTypes.oneOf(Object.values(Placement)).isRequired,
  onClick: PropTypes.func,
})

export {
  FlagProps,
  flagShape,
}
