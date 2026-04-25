
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 80%;
  min-width: 15rem;
  margin-bottom: 1rem;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 1.2rem;
  margin-right: 1rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.grayscale20};
`

const MessageWrapper = styled.div`
  position: relative;
  align-self: end;
  display: flex;
  flex-direction: column;
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
  margin-left: 1rem;
`

const MessageOwner = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
`

const MessageContentWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`

const Message = styled.pre`
  padding: 1rem 1.5rem;
  font-size: 1.4rem;
  font-family: Open Sans, sans-serif;
  white-space: pre-wrap;
  border-radius: 0 2.4rem 2.4rem 2.4rem;
  background-color: ${(props) => props.theme.color.grayscale20};
`

export {
  Wrapper,
  LogoWrapper,
  MessageWrapper,
  MessageOwner,
  MessageHeader,
  MessageTime,
  Message,
  MessageContentWrapper,
}
