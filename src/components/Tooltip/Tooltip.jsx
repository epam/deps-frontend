
import AntdTooltip from 'antd/es/tooltip'
import PropTypes from 'prop-types'
import { childrenShape } from '@/utils/propTypes'
import 'antd/lib/tooltip/style/index.less'

const Tooltip = ({
  children,
  triggerClassName,
  open,
  ...restProps
}) => (
  <AntdTooltip
    open={open}
    {...restProps}
  >
    <span
      className={triggerClassName}
      style={{ display: 'block' }}
    >
      {children}
    </span>
  </AntdTooltip>
)

Tooltip.propTypes = {
  children: childrenShape,
  open: PropTypes.bool,
  triggerClassName: PropTypes.string,
}

export {
  Tooltip,
}
