
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  align-self: center;

  & > svg {
    margin-right: 1rem;
  }
`

export {
  StyledButton as Button,
}
