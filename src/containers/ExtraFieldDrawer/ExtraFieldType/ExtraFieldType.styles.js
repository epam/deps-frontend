
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFieldLabel = styled(FieldLabel)`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  text-transform: uppercase;
  margin-bottom: 0.8rem;
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 1.2rem;
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale16};
  border: none; 
  cursor: not-allowed;
`

export {
  Wrapper,
  StyledInput as Input,
  StyledFieldLabel as FieldLabel,
}
