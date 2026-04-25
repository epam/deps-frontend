
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  flex-shrink: 0;
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: ${(props) => props.theme.color.grayscale18};
`

export const Counter = styled.span`
  margin-inline: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.2rem;
  
  ${({ $isError, theme }) => $isError && css`
    color: ${theme.color.error};
  `}
`
