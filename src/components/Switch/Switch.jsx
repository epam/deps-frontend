
import PropTypes from 'prop-types'
import { StyledSwitch } from './Switch.styles'

const Switch = ({
  innerRef,
  indeterminate,
  ...restProps
}) => (
  <StyledSwitch
    {...restProps}
    ref={innerRef}
    $indeterminate={indeterminate}
  />
)

Switch.propTypes = {
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  indeterminate: PropTypes.bool,
}

export {
  Switch,
}
