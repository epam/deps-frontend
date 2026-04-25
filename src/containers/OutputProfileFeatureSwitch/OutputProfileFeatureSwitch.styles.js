
import styled from 'styled-components'

const FeatureSwitcher = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  padding: 0.8rem 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.4rem;
  background-color: ${(props) => props.theme.color.primary3};
`

const FeatureLabel = styled.label`
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 2.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export {
  FeatureLabel,
  FeatureSwitcher,
}
