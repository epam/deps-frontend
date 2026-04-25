
import styled from 'styled-components'

const ExtractionName = styled.div`
  font-weight: 400;
  padding: 1px 0;
  color: ${(props) => props.theme.color.grayscale18};
  font-size: 1.4rem;
  line-height: 2.2rem;
`

const LLMType = styled.div`
  color: ${(props) => props.theme.color.grayscale12};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2rem;
  padding: 1px 0;
`

export {
  ExtractionName,
  LLMType,
}
