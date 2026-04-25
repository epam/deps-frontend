
import styled, { css } from 'styled-components'
import { HandsonTable } from '@/components/HandsonTable'

const StyledHandsonTable = styled(HandsonTable)`
  margin: 1.5rem;
  ${(props) => props.readOnly && css`
      td,
      th {
        cursor: not-allowed;
      } 
    `}
`

export {
  StyledHandsonTable,
}
