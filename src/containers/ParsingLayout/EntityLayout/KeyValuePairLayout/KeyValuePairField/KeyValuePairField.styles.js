
import styled from 'styled-components'
import { Input } from '@/components/Input'

const ContentWrapper = styled.div`
  display: flex;
  border: 0.2rem solid ${(props) => props.theme.color.grayscale4};
  border-radius: 0.5rem;
  padding: 1.5rem 0.5rem 0.5rem 1rem;
  margin: 0.5rem;
`

const InputWrapper = styled.div`
  display: flex;
  width: 100%;
`

const KeyWrapper = styled(InputWrapper)`
  flex: 0 0;
  flex-basis: 37%;
  margin-right: 2.5rem;
`

const ValueWrapper = styled(InputWrapper)`
  flex: 1 1;
  flex-basis: 60%;
`

const StyledInput = styled(Input)`
  margin-right: 0.5rem;
`

export {
  KeyWrapper,
  ValueWrapper,
  ContentWrapper,
  StyledInput as Input,
}
