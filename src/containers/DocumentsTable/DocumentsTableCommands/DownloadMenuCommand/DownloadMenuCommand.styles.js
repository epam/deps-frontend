
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const RotatableIconWrapper = styled.span`
  svg {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${(props) => (props.$isRotated ? 180 : 0)}deg);
  }
`

export const StyledDropdownButton = styled(Button)`
  display: flex;
  gap: 0.8rem;
`
