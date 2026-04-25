
import styled from 'styled-components'
import { FormItem } from '@/components/Form'

const Wrapper = styled.div`
  margin-bottom: 1.6rem;
`

const SwitchFormItem = styled(FormItem)`
  flex-direction: row;
  margin-bottom: 1.6rem;
  padding: 1.6rem;
  background: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;
  
  & ~ div {
    margin-bottom: 0;
  }
`

const SwitchFormItemWithSubInfo = styled(FormItem)`
  margin-bottom: 1.6rem;
  padding: 1.6rem;
  background: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;

  .ant-input-number {
    width: 100%;
  }
  
  & > div {
    text-transform: uppercase;
  }
`

const DefaultFormItem = styled(FormItem)`
  & > div {
    text-transform: uppercase;
  }
`

export {
  Wrapper,
  SwitchFormItem,
  DefaultFormItem,
  SwitchFormItemWithSubInfo,
}
