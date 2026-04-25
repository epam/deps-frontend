
import styled from 'styled-components'
import GenAiChatEmpty from '@/assets/images/genAiChatEmpty.png'
import { Spin } from '@/components/Spin'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 5rem;
  border-radius: 8px;
  background-color: ${(props) => props.theme.color.grayscale14};
`

const Notification = styled.p`
  position: absolute;
  top: 0;
  width: calc(100% - 1.5rem);
  margin: 1rem 0.75rem 0;
  padding: 0.6rem 1.5rem;
  text-align: center;
  border-radius: 1.6rem;
  background: ${({ theme }) => `
    linear-gradient(to right, ${theme.color.primary2Darker}, ${theme.color.primary2})
    `};
  color: ${(props) => props.theme.color.grayscale14};
`

const Conversation = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-inline: 1.5rem;

  @media (min-height: ${ScreenBreakpoint.tablet}) {
    height: 50vh;
  }
`

const ChatFooter = styled.div`
  display: flex;
  align-items: start;
  width: 100%;
  padding: 1.5rem 1.5rem 1rem;
  border-top: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 0 0 8px 8px;
  background-color: ${(props) => props.theme.color.primary3};
`

const EmptyChatImage = styled.div`
  height: 100%;
  margin: 2.5rem 0;
  background-image: url(${GenAiChatEmpty});
  background-position-x: center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-height: ${ScreenBreakpoint.tablet}) {
    min-height: 40vh;
  }
`

const StyledSpin = styled(Spin)`
  &, .ant-spin-container {
    min-height: 0;
    height: 100%;
    width: 100%;
  }
`

export {
  Wrapper,
  Notification,
  Conversation,
  ChatFooter,
  EmptyChatImage,
  StyledSpin as Spin,
}
