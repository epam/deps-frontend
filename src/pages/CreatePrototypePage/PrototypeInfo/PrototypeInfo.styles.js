
import styled from 'styled-components'
import { PrototypeFieldsViewSwitch } from '@/containers/PrototypeFieldsViewSwitch'

const FieldsWrapper = styled.div`
  flex-grow: 1;
  display: grid;
  grid-gap: 1.6rem;
  grid-template-columns: 20% 20% 20% auto;
`

const Wrapper = styled.div`
  display: flex;
  gap: 1.6rem;
`

const StyledPrototypeFieldsViewSwitch = styled(PrototypeFieldsViewSwitch)`
  margin-top: 2.5rem;
`

export {
  FieldsWrapper,
  StyledPrototypeFieldsViewSwitch as PrototypeFieldsViewSwitch,
  Wrapper,
}
