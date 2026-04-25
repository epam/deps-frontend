
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.8rem;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const Title = styled.div`
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 2.2rem;
  margin-bottom: 1.6rem;
`

export {
  Title,
  Wrapper,
}
