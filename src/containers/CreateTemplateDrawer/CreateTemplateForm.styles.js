
import styled from 'styled-components'
import { Checkbox } from '@/components/Checkbox'
import { FormItem } from '@/components/Form/ReactHookForm'
import { Tooltip } from '@/components/Tooltip'

const StyledTooltip = styled(Tooltip)`
  width: 100%;

  &:has(.ant-checkbox-wrapper) {
    width: fit-content;
  }

  & > div {
    display: block;
  }
`

const StyledCheckbox = styled(Checkbox)`
  width: fit-content;
`

const CheckboxFormItem = styled(FormItem)`
  flex-direction: row-reverse;
  align-items: center;
  position: absolute;
  top: 51rem;
  left: 50%;
  transform: translate(-50%, -50%);
  
  .ant-checkbox-wrapper {
    margin-right: 1rem;
  }
`

export {
  StyledTooltip,
  StyledCheckbox,
  CheckboxFormItem,
}
