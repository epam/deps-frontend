
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  padding: 1.6rem;
  margin: 1.6rem;
  flex-direction: column;
  gap: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 4px;
`

export const FieldNameWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid ${(props) => props.theme.color.grayscale1};
`
