
import styled from 'styled-components'
import { Form, FormItem } from '@/components/Form'

export const StyledFormItem = styled(FormItem)`
  &:first-child {
    display: inline-flex;
    margin-bottom: 2rem;
    grid-column: auto;
    flex-direction: row;
    justify-self: start;

    & > div {
      font-size: 1.4rem;
      margin-right: 1.2rem;
    }
  }
`

export const StyledForm = styled(Form)`
  height: 100%;
  flex-basis: 50%;
  width: calc(50% - 2.4rem);
`
