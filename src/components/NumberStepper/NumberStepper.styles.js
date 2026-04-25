
import styled from 'styled-components'
import { InputNumber } from '@/components/InputNumber'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

const StyledInputNumber = styled(InputNumber)`
  flex-grow: 1;
`

export {
  StyledInputNumber as InputNumber,
  Wrapper,
}
