
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledButton = styled(Button.Secondary)`
  margin: 1rem auto;
`

const Wrapper = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export {
  StyledButton as Button,
  Wrapper,
}
