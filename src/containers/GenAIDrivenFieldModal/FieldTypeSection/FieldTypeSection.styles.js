
import styled from 'styled-components'
import { DualToggle } from '@/components/DualToggle'
import { FormItem } from '@/components/Form/ReactHookForm'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  border-radius: 8px;
  padding: 1.6rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const TypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  > div:first-child {
    flex-grow: 1;
  }
`

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
`

const StyledDualToggle = styled(DualToggle)`
  && .ant-radio-button-wrapper {
    width: 10rem;
  }
`

const StyledFormItem = styled(FormItem)`
  margin: 0;
`

export {
  SectionTitle,
  StyledDualToggle as DualToggle,
  StyledFormItem as FormItem,
  TypeWrapper,
  Wrapper,
}
