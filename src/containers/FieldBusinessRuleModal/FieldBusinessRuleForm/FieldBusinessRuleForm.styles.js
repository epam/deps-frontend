
import styled from 'styled-components'
import { DualToggle } from '@/components/DualToggle'
import { Form, FormItem } from '@/components/Form/ReactHookForm'

const FieldsColumnWrapper = styled.div`
  width: 50%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "name name"
    "severity listMode"
    "validatedFields validatedFields"
    "dependentFields dependentFields"
    "issueMessage issueMessage"
    "rule rule";
  gap: 1.6rem;
`

const StyledForm = styled(Form)`
  height: 100%;
  display: flex;
  padding: 1.6rem;
  gap: 1.6rem;
`

const StyledFormItem = styled(FormItem)`
  margin: 0;
  grid-area: ${({ $area }) => $area};
`

const RuleFormItem = styled(FormItem)`
  height: 100%;
  width: 100%;
  max-width: 55%;
  margin-bottom: 0;

  & > div[data-error] {
    display: none;
  }
`

const Toggle = styled(DualToggle)`
  && > .ant-radio-button-wrapper {
    max-width: 14rem;
    width: 100%;
  }
`

const FieldOptionWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
`

const FieldOptionType = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 0.8rem;
  color: ${({ theme }) => theme.color.textSecondary};
`

const FieldOptionIcon = styled.span`
  display: flex;
`

export {
  FieldsColumnWrapper,
  RuleFormItem,
  StyledForm as Form,
  StyledFormItem as FormItem,
  Toggle,
  FieldOptionWrapper,
  FieldOptionType,
  FieldOptionIcon,
}
