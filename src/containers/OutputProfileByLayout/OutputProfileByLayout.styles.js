
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.color.grayscale14};
  border-radius: 0 0 0.8rem 0.8rem;
  padding: 1.6rem;
  height: 35.2rem;
`

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 1.6rem;
  color: ${(props) => props.theme.color.grayscale16};
`

const FeaturesWrapper = styled.div`
  display: grid;
  gap: 1.6rem;
  max-width: 32rem;
`

export {
  FeaturesWrapper,
  Wrapper,
  Title,
}
