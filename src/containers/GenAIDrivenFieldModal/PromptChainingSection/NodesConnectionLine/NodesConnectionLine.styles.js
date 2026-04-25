
import styled from 'styled-components'

const LineContainer = styled.div`
  width: 2rem;
  min-height: 3.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const VerticalLine = styled.div`
  height: 100%;
  width: 2px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.grayscale17};
`

export {
  LineContainer,
  VerticalLine,
}
