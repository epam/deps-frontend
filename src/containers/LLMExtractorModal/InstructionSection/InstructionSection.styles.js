
import styled from 'styled-components'
import { FormItem } from '@/components/Form/ReactHookForm'
import { Input } from '@/components/Input'

const StyledFormItem = styled(FormItem)`
  height: 100%;
  margin: 0;
`

const Wrapper = styled.div`
  width: 50%;
  padding: 1.6rem 1.6rem 1.6rem 0;
`

const StyledTextArea = styled(Input.TextArea)`
  border-radius: 0.8rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  font-weight: 400;
  height: 100% !important;
  line-height: 2.2rem;
  padding: 1.6rem;
`

export {
  StyledFormItem as FormItem,
  StyledTextArea as TextArea,
  Wrapper,
}
