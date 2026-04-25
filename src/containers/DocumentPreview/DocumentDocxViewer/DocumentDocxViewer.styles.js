
import styled from 'styled-components'

const Content = styled.div`
  width: 90%;
  height: 90%;
  overflow: scroll;
  box-shadow: 0 2px 0.4rem ${(props) => props.theme.color.grayscale1};
  padding: 1rem;
  margin: auto;
`
export {
  Content,
}
