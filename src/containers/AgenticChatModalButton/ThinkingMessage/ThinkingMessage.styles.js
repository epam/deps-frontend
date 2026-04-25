
import styled, { keyframes } from 'styled-components'
import { ThoughtIcon } from '@/components/Icons/ThoughtIcon'

const MessageWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const AnimatedDots = styled.span`
  display: inline-block;

  span {
    animation: pulse 1.4s ease-in-out infinite;
    
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
`

const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
`

const AnimatedThoughtIcon = styled(ThoughtIcon)`
  svg {
    animation: ${pulse} 1.4s ease-in-out infinite;
    transform-origin: center;
    will-change: transform, opacity;
    path {
      fill: ${(props) => props.theme.color.primary2};
    }
  }
`

export {
  MessageWrapper,
  AnimatedDots,
  AnimatedThoughtIcon,
}
