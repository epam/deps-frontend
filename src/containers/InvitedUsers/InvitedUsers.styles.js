
import styled from 'styled-components'

const StyledRow = styled.span`
  color: ${(props) => props.theme.color.primary2};
`

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export {
  StyledRow,
  ActionsWrapper,
}
