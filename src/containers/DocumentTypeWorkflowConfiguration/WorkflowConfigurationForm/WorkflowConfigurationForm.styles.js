
import styled, { css } from 'styled-components'
import { FormFieldType } from '@/components/Form'
import { FormItem } from '@/components/Form/ReactHookForm'
import { FieldLabel } from '@/components/Form/ReactHookForm/FormItem.styles'

const WorkflowFormItem = styled(FormItem)`
  display: flex;
  flex-direction: column;
  padding: 1.6rem;
  background: ${(props) => props.theme.color.grayscale14};
  border-radius: 0.8rem;

  ${FieldLabel} {
    text-transform: uppercase;
    line-height: 2rem;
  }
    
  ${(props) => props.field?.type === FormFieldType.CHECKMARK && css`
    flex-direction: column;
    align-items: stretch;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-auto-rows: auto;
      
    & > div[data-error] {
      grid-column: 1 / -1;
      margin-top: 0;
    }
  `}
`

export {
  WorkflowFormItem,
}
