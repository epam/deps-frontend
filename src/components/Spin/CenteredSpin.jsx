
import PropTypes from 'prop-types'
import { Spin } from '@/components/Spin'
import { ComponentSize } from '@/enums/ComponentSize'
import { StyledCenteredSpinWrapper } from './CenteredSpin.styles'

const CenteredSpin = ({ spinning = false, size }) => (
  <StyledCenteredSpinWrapper>
    <Spin
      size={size}
      spinning={spinning}
    />
  </StyledCenteredSpinWrapper>
)

CenteredSpin.propTypes = {
  size: PropTypes.oneOf(Object.values(ComponentSize)),
  spinning: PropTypes.bool,
}

export {
  CenteredSpin,
}
