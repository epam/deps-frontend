
import styled from 'styled-components'

const MessageWrapper = styled.div`
  position: relative;
  align-self: end;
  display: flex;
  flex-direction: column;
  max-width: 80%;
  min-width: 15rem;
`

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${(props) => props.theme.color.grayscale11};
`

const MessageTime = styled.span`
  font-size: 1rem;
  font-weight: 600;
`

const MessageOwner = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
`

const Message = styled.pre`
  font-family: 'Open Sans', sans-serif;
  padding: 1rem 1.5rem;
  font-size: 1.4rem;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  border-radius: 2.4rem 0 2.4rem 2.4rem;
  background-color: ${(props) => props.theme.color.primary3};
`

export {
  MessageWrapper,
  MessageOwner,
  MessageHeader,
  MessageTime,
  Message,
}
