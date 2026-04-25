
import styled from 'styled-components'

const SelectorsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.2rem;
  margin-left: 1.6rem;
  flex-wrap: wrap;
`

const StyledText = styled.span`
  font-size: 1.2rem;
  line-height: 1.6rem;
  margin: 0 1.6rem;
`

const StyledSelectorLabel = styled.label`
  display: flex;
  align-items: center;
  height: 3.2rem;
  margin: 0 1.6rem 5px 0;
  padding: 0 1.6rem;
  outline: 1px solid ${(props) => props.theme.color.grayscale21};
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 8px;
  font-weight: 600;
  
  &:hover {
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  }
`

export {
  SelectorsWrapper,
  StyledSelectorLabel as SelectorLabel,
  StyledText,
}
