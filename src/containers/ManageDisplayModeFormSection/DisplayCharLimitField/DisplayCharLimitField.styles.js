
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'

const ExampleWrapper = styled.div`
  padding: 1.6rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale1};
  margin-top: 1.6rem;
`

const StyledFieldLabel = styled(FieldLabel)`
  font-size: 1.2rem;
  text-transform: uppercase;
`

export {
  ExampleWrapper,
  StyledFieldLabel as FieldLabel,
}
