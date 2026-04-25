
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const Wrapper = styled.div`
  display: flex;
  gap: 1.6rem;
  padding: 1.6rem;
  border: 1px solid ${({ theme }) => theme.color.grayscale1};
  border-radius: 0 0 0.4rem 0.4rem;
`

export const TextButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: auto;
  color: ${(props) => props.theme.color.primary2};
`

export const CloseButton = styled(Button.Secondary)`
  margin-left: auto;
`
