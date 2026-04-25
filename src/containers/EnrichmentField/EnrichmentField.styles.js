
import styled from 'styled-components'
import { FieldInputWrapper } from '@/containers/DocumentField'

const StyledFieldInputWrapper = styled(FieldInputWrapper)`
  padding: 0;

  > div {
    flex-grow: 1;
    height: 100%;
  }
`

export {
  StyledFieldInputWrapper as FieldInputWrapper,
}
