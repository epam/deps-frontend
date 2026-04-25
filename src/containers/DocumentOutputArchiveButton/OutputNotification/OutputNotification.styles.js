
import styled from 'styled-components'
import { Button } from '@/components/Button'
import { ProfileStatus } from '../enums/ProfileStatus'

const WarningMessage = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`

const InfoMessage = styled.div`
  display: flex;
  padding: 0.8rem;
  margin-top: 1.5rem;
  font-size: 1rem;
  line-height: 1.4rem;
  border: 1px solid ${(props) => props.theme.color.primary2};
  border-radius: 4px;
  background-color: ${(props) => props.theme.color.grayscale20};
  color: ${(props) => props.theme.color.grayscale12};
`

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.8rem;
  font-size: 1rem;
  line-height: 1.4rem;
  border: 1px solid ${({ theme, profileStatus }) => (
    profileStatus === ProfileStatus.OUTDATED
    ? theme.color.warning
    : theme.color.error
  )};
  border-radius: 4px;
  background-color: ${({ theme, profileStatus }) => (
    profileStatus === ProfileStatus.OUTDATED
    ? theme.color.warningBg
    : theme.color.errorBg
  )};
  color: ${(props) => props.theme.color.grayscale12};

  & > svg {
    margin-right: 1rem;
    fill: ${({ theme, profileStatus }) => (
      profileStatus === ProfileStatus.DELETED && theme.color.error
    )};
  }

  & > span {
    display: flex !important;
    margin-left: auto;
    font-size: 1.4rem;
  }

  & .ant-tooltip {
    min-width: 28rem;
    font-size: 1rem;
  }

  & .ant-tooltip-arrow {
    display: none;
  }
`

const IconButton = styled(Button.Icon)`
  width: 3.2rem;
  height: 3.2rem;
  margin-left: 1.2rem;
  border: 1px solid ${(props) => props.theme.color.warning};
  background-color: ${(props) => props.theme.color.primary3};
  transition: all 0.3s cubic-bezier(0.645,0.045,0.355,1);

  & > svg {
    fill: ${(props) => props.theme.color.warning};
  }
`

const WarningText = styled.p`
  margin-bottom: 0;
`

const IconWrapper = styled.div`
  display: flex;
  margin-right: 1rem;
  font-size: 1.4rem;
  color: ${(props) => props.theme.color.primary2};
  animation: rotating 1.5s linear infinite;

  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export {
  WarningMessage,
  InfoMessage,
  InfoWrapper,
  IconButton,
  WarningText,
  IconWrapper,
}
