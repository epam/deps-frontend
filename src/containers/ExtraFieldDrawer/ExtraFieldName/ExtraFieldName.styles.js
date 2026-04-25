
import styled from 'styled-components'
import { FieldLabel } from '@/components/FieldLabel'
import { Input } from '@/components/Input'

const Wrapper = styled.div`
  margin-bottom: 1.6rem;
`

const StyledFieldLabel = styled(FieldLabel)`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  text-transform: uppercase;
  margin-bottom: 0.8rem;
  margin-top: 1.6rem;
`

const StyledInput = styled(Input)`
  width: 100%;
  color: ${(props) => props.theme.color.grayscale18};
  border: 0.1rem solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
`

export {
  Wrapper,
  StyledInput as Input,
  StyledFieldLabel as FieldLabel,
}
