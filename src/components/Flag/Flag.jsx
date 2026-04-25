
import PropTypes from 'prop-types'
import { Tooltip } from '@/components/Tooltip'
import { Placement } from '@/enums/Placement'
import { FlagComponent } from './Flag.styles'

const Flag = ({ type, symbol, title, tooltipPlacement, onClick }) => {
  return title ? (
    <Tooltip
      placement={tooltipPlacement}
      title={title}
    >
      <FlagComponent
        onClick={onClick}
        type={type}
      >
        {symbol}
      </FlagComponent>
    </Tooltip>
  )
    : (
      <FlagComponent
        onClick={onClick}
        type={type}
      >
        {symbol}
      </FlagComponent>
    )
}

Flag.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  type: PropTypes.string.isRequired,
  symbol: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  tooltipPlacement: PropTypes.oneOf(Object.values(Placement)),
  onClick: PropTypes.func,
}

export {
  Flag,
}
