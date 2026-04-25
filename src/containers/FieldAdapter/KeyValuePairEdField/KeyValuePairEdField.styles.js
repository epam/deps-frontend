
import styled from 'styled-components'
import { FieldInputWrapper } from '@/containers/DocumentField'

const StyledFieldInputWrapper = styled(FieldInputWrapper)`
  height: 100%;
  padding: 0;
`

const Element = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  align-self: stretch;
`

const InfoWrapperCell = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-left: auto;
`

export {
  StyledFieldInputWrapper as FieldInputWrapper,
  Element,
  InfoWrapperCell,
}
