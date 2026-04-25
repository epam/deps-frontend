
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const Label = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${(props) => props.theme.color.grayscale11};
`

export const PromptHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const TextButton = styled(Button.Text)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: auto;
  color: ${(props) => props.theme.color.primary2};

  &:disabled:hover {
    background-color: inherit;
  }
`
