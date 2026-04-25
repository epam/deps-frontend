
import styled from 'styled-components'

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`

export const ToggleLabel = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
  cursor: pointer;
  user-select: none;
`
