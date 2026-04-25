
import styled from 'styled-components'
import { Button } from '@/components/Button'

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
`
const ButtonText = styled.span`
  flex-grow: 1;
`

export {
  StyledButton,
  ButtonText,
}
