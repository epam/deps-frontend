
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const Wrapper = styled.div`
  display: flex;
  gap: 1.6rem;
`

export const TextButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: auto;
  color: ${(props) => props.theme.color.primary2};
`

export const CloseButton = styled(Button)`
  margin-left: auto;
`
