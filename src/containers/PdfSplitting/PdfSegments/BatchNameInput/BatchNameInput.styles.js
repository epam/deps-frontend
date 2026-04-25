
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`

export const StyledFieldLabel = styled(FieldLabel)`
  color: ${(props) => props.theme.color.grayscale11};
  text-transform: uppercase;
  font-weight: 600;
  font-size: 1.2rem;
`
