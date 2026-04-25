
import styled from 'styled-components'
import { Badge } from '@/components/Badge'
import { ErrorTriangleIcon } from '@/components/Icons/ErrorTriangleIcon'
import { FileRestartButton } from '@/containers/FileRestartButton'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const StyledBadge = styled(Badge)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .ant-badge-status-text {
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .ant-badge-status-dot {
    display: flex;
    flex-shrink: 0;
  }
`

export const StyledFileRestartButton = styled(FileRestartButton)`
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: ${(props) => props.theme.color.primary2};
  padding: 0 0 0 1.4rem;
  height: auto;
  
  &:hover {
    background: transparent;
  }
  
  &:disabled {
    color: ${(props) => props.theme.color.grayscale5};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const WarningTriangleIcon = styled(ErrorTriangleIcon)`
  color: ${(props) => props.theme.color.warning};
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
`
