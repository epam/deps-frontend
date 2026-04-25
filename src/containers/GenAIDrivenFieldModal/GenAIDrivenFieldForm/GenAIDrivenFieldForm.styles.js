
import styled from 'styled-components'
import { Form, FormItem } from '@/components/Form/ReactHookForm'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`

const FieldsList = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding: 1.6rem;
  overflow: auto;
`

const BaseFieldsWrapper = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: flex-start;
  
  > div:first-child {
    flex-grow: 1;
  }
  
  > div:last-child {
    margin-top: 3rem;
  }
`

const StyledForm = styled(Form)`
  height: 100%;
`

const StyledFormItem = styled(FormItem)`
  margin: 0;
`

const PromptChainingFormItem = styled(FormItem)`
  height: 100%;
  padding: 1.6rem;
  width: 100%;
  max-width: 55%;
  margin-bottom: 0;

  & > div[data-error] {
    display: none;
  }
`

export {
  BaseFieldsWrapper,
  FieldsList,
  PromptChainingFormItem,
  StyledForm as Form,
  StyledFormItem as FormItem,
  Wrapper,
}
