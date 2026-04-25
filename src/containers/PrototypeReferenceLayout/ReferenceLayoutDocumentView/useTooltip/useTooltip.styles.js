
import styled from 'styled-components'
import { Tooltip } from '@/components/Tooltip'

const StyledTooltip = styled(Tooltip)`
  & {
    position: absolute !important;
    top: ${(props) => props.$top}px;
    left: ${(props) => props.$left}px;
  }

  .ant-tooltip-arrow {
    display: none !important;
  }
`

export {
  StyledTooltip as Tooltip,
}
