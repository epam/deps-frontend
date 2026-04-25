
import AntdSpin from 'antd/es/spin'
import 'antd/lib/spin/style/index.less'
import PropTypes from 'prop-types'
import { SPINNER } from '@/constants/automation'
import { ComponentSize } from '@/enums/ComponentSize'
import { childrenShape } from '@/utils/propTypes'

const dataTestId = 'spin'

const Spin = ({
  children,
  spinning = false,
  size,
  className,
  indicator,
}) => (
  <AntdSpin
    className={className}
    data-automation={SPINNER}
    data-testid={dataTestId}
    indicator={indicator}
    size={size}
    spinning={spinning}
    wrapperClassName={className}
  >
    {children}
  </AntdSpin>
)

Spin.propTypes = {
  children: childrenShape,
  size: PropTypes.oneOf(Object.values(ComponentSize)),
  spinning: PropTypes.bool,
  className: PropTypes.string,
  indicator: childrenShape,
}

export {
  Spin,
}
