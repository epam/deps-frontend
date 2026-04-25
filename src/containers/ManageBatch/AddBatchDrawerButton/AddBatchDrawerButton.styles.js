
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const StyledButton = styled(Button)`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1.4rem;
  align-items: center;
  font-weight: 600;
  padding: 0 2rem;
`

export const TextButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: ${(props) => props.theme.color.primary2};
`
