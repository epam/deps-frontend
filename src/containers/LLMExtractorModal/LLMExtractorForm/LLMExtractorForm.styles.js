
import styled from 'styled-components'
import { Form } from '@/components/Form/ReactHookForm'
import { InputNumber } from '@/components/InputNumber'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`

const FieldsList = styled.div`
  width: 50%;
  padding: 1.6rem;
`

const FieldsWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  gap: 1.6rem;
`

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  color: ${(props) => props.theme.color.grayscale18};
`

const StyledForm = styled(Form)`
  height: 100%;
`

export {
  FieldsList,
  FieldsWrapper,
  StyledForm as Form,
  StyledInputNumber as InputNumber,
  Wrapper,
}
