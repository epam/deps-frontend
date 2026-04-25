
import styled from 'styled-components'

const StyledTable = styled.table`
  width: 100%;
  margin-bottom: 1rem;
`

const StyledCell = styled.td`
  border: 1px solid black;
`

const StyledHighlightedCell = styled(StyledCell)`
  background-color: ${(props) => props.theme.color.primary2Light};
`

export {
  StyledTable,
  StyledCell,
  StyledHighlightedCell,
}
