
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.6rem 0;
`

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale13};
  margin-bottom: 1.6rem;
`

const FeaturesWrapper = styled.div`
  display: grid;
  gap: 16px;
`

export {
  FeaturesWrapper,
  Label,
  Wrapper,
}
