
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  flex-shrink: 0;
  padding: 1.6rem;
  border-radius: 0 0 8px 8px;
  background-color: ${(props) => props.theme.color.primary3};
  border-top: 1px solid ${(props) => props.theme.color.grayscale15};
    
  ${(props) => props.$isExpanded && css`
    border-top: none;
    border-radius: 0.8rem;
  `}
`

export {
  Wrapper,
}
