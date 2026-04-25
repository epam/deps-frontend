
import styled from 'styled-components'
import { Badge } from '@/components/Badge'

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
