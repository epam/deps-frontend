
import styled from 'styled-components'
import GenAiChatEmpty from '@/assets/images/genAiChatEmpty.png'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0.8rem 1.5rem;
`

const EmptyChatImage = styled.div`
  height: 100%;
  margin: 1.5rem 0;
  background-image: url(${GenAiChatEmpty});
  background-position-x: center;
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-height: ${ScreenBreakpoint.tablet}) {
    min-height: 30vh;
  }
`

export {
  EmptyChatImage,
  Wrapper,
}
