
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0 2rem;
`

const Wrapper = styled.div`
  display: flex;
  gap: 1.6rem;
`

export {
  Wrapper,
  StyledButton as SaveButton,
}
