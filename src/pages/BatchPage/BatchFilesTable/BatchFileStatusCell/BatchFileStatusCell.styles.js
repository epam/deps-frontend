
import styled from 'styled-components'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const WarningIcon = styled(ErrorTriangleIcon)`
  color: ${(props) => props.theme.color.warning};
  cursor: pointer;
`
