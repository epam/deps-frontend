
import styled from 'styled-components'
import { Tooltip } from '@/components/Tooltip'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const StyledTooltip = styled(Tooltip)`
  margin-left: auto;
`

const ActionWrapper = styled.div`
  display: flex;
`

export {
  ActionWrapper,
  StyledTooltip as Tooltip,
  Wrapper,
}
