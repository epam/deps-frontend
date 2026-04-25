
import styled from 'styled-components'

const ExtractionTypeTag = styled.div`
  padding: 0.6rem 1.2rem;
  background-color: ${(props) => props.theme.color.primary3};
  color: ${(props) => props.theme.color.grayscale18};
  font-weight: 600;
  border-radius: 8px;
`

const HeaderExtraWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  margin-left: 1.6rem;
  gap: 1.6rem;
`

const Controls = styled.div`
  display: flex;
  gap: 1.6rem;
`

export {
  Controls,
  ExtractionTypeTag,
  HeaderExtraWrapper,
}
