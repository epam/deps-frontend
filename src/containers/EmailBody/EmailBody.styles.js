
import styled, { css } from 'styled-components'

const EmailBodyWrapper = styled.div`
  padding: 1.5rem;
  margin-bottom: 0.8rem;
  background-color: ${(props) => props.theme.color.primary3};
  font-size: 1.2rem;
`

const EmailBodyContent = styled.p`
  padding: 0.7rem 3rem;
  border-radius: 4px;
  margin-bottom: 0;
  
  ${(props) => props.collapsed && css`
    height: 7.5rem;
    overflow: hidden;
  `}
`

const EmailEmptyBody = styled.p`
  max-width: 18rem;
  margin: auto;
  color: ${(props) => props.theme.color.grayScale5};
  text-align: center;
  font-size: 1.3rem;
`

export {
  EmailBodyContent,
  EmailBodyWrapper,
  EmailEmptyBody,
}
