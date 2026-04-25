
import styled from 'styled-components'
import { Button } from '@/components/Button'

const IconWrapper = styled.div`
  font-weight: 600;
  margin-left: auto;
`

const StyledButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  line-height: 2.2rem;
  height: 5.6rem;
  margin-bottom: 1.6rem;
  padding: 0 1.6rem 0 0;

  &:last-child {
    margin-bottom: 0;
  }

  & svg {
    fill: ${(props) => props.theme.color.grayscale11};
  }

  &.ant-btn-ghost {
    border-color: ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.grayscale14};
    color: ${(props) => props.theme.color.grayscale11};
  }
`

const LogoWrapper = styled.div`
  align-self: stretch;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.color.primary3};
  width: 4.8rem;
  padding-left: 1.2rem;
  margin-right: 1.6rem;
  border-radius: 0.6rem 4rem 4rem 0.6rem;
`

const TextButton = styled(Button)`
  display: flex;
  align-items: center; 
  height: 5.6rem;
  width: 100%;
  padding: 1.2rem 0 0.4rem;
  margin-bottom: 1rem;
  border: none;
  box-shadow: none;

  &.ant-btn-ghost {
    border-top: 1px solid ${(props) => props.theme.color.grayscale2};
  }

  &.ant-btn-ghost:hover,
  &.ant-btn-ghost:active {
    background-color: ${(props) => props.theme.color.primary3};
    color: ${(props) => props.theme.color.borderIcon};
  }

  &::after {
    all: unset;
  }
`

const StorageIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  width: 4.3rem;
  padding: 0;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 50%;
`

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 1rem;

  & > svg {
    margin-right: 0.4rem;
  }
`

export {
  IconWrapper,
  StyledButton as Button,
  LogoWrapper,
  TextButton,
  StorageIconWrapper,
  TextWrapper,
}
