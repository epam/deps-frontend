
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.6rem;
  margin-bottom: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const Title = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
`

export {
  Wrapper,
  Title,
}
