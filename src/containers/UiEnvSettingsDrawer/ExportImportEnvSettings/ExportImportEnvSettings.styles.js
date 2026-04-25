
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const ButtonIcon = styled(Button.Icon)`
  padding: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
`

export const BtnGroup = styled.div`
  display: grid;
  grid-gap: 1.6rem;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
`
