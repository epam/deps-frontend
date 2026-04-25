
import styled from 'styled-components'

const Content = styled.div`
  width: 90%;
  height: 90%;
  overflow: scroll;
  box-shadow: 0 0.2rem 0.4rem ${({ theme }) => theme.color.grayscale1};
  padding: 1rem;
  margin: auto;
`

export {
  Content,
}
