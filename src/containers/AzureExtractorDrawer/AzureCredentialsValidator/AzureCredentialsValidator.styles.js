
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  height: 9.8rem;
  padding: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale15};
  border-radius: 0.8rem;
  background-color: ${({ $inProgress, theme }) => $inProgress
    ? theme.color.grayscale14
    : theme.color.primary3};
`

const Message = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

export {
  Message,
  Wrapper,
}
