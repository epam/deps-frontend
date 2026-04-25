
import styled from 'styled-components'

export const Wrapper = styled.label`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  justify-content: left;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  line-height: 2.2rem;
  font-weight: 600;
  cursor: pointer;
`
