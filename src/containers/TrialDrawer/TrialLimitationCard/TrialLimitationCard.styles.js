
import styled from 'styled-components'

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.color.grayscale21};
  background-color: ${(props) => props.theme.color.grayscale14};
  color: ${(props) => props.theme.color.grayscale18};
  margin-bottom: 1.6rem;

  &:last-child {
    margin-bottom: 0;
  }
`

const LimitValueWrapper = styled.span`
  margin-left: 0.4rem;
`

const Hint = styled.span`
  font-weight: 400;
  margin-left: auto;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.color.error};
`

export {
  CardWrapper,
  LimitValueWrapper,
  Hint,
}
