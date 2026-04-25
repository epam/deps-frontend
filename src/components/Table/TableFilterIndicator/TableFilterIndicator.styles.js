
import styled, { css } from 'styled-components'

export const Wrapper = styled.span`
  display: flex;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.grayscale17};
  
  ${({ $active, theme }) => $active && css`
    color: ${theme.color.primary2};
    
    & > span {
      color: ${theme.color.primary2};
    }
  `}
`
