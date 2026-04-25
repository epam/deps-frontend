
import styled, { css } from 'styled-components'

const EmailInfoWrapper = styled.div`
  margin-bottom: 0.8rem;
  padding: 3rem 1.5rem 1.5rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.primary3};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: space-between;
  height: 20rem;
  column-gap: 2rem;

  ${(props) => props.collapsed && css`
    height: 9rem;
    overflow: hidden;
  `}
`

const EmailInfoFieldWrapper = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.color.grayscale3};
`

const EmailInfoFieldTitle = styled.div`
  max-width: 10rem;
  margin-right: 1.6rem;
  width: 100%;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.color.shadow1};
`

const EmailInfoFieldContent = styled.div`
  flex-grow: 1;
  padding: 0.4rem 0.8rem;
  background-color: ${(props) => props.theme.color.primary5};
  border-radius: 4px;
`

export {
  EmailInfoWrapper,
  EmailInfoFieldWrapper,
  EmailInfoFieldTitle,
  EmailInfoFieldContent,
}
