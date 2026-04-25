
import styled from 'styled-components'

const LocalBoundary = styled.div`
  display: grid;
  margin: 0.5rem 0;
  padding: 1rem;
  align-items: center;
  border: 1px solid ${(props) => props.theme.color.warning};
  border-radius: 4px;
`

export {
  LocalBoundary,
}
