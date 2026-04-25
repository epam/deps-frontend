
import styled from 'styled-components'
import { FieldInputWrapper } from '@/containers/DocumentField'

const StyledFieldInputWrapper = styled(FieldInputWrapper)`
  height: calc(100% - 2rem);
  padding: 0;

  > div {
    flex-grow: 1;
    height: 100%;
  }
`

const Element = styled.div`
  width: 50%;
  align-self: stretch;
`

export {
  StyledFieldInputWrapper as FieldInputWrapper,
  Element,
}
