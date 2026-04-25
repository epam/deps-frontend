
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const SwitcherWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const IconButton = styled(Button.Icon)`
  padding: 0.8rem;
  border: 1px solid ${({ theme }) => theme.color.grayscale21};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.grayscale14};

  & svg {
    color: ${({ theme }) => theme.color.primary2};
  }
`
