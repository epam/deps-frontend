
import styled, { css } from 'styled-components'
import { LockIcon } from '@/components/Icons/LockIcon'
import { ScissorsIcon } from '@/components/Icons/ScissorsIcon'

export const SeparatorContainer = styled.div`
  position: relative;
  width: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  cursor: pointer;
  background-color: ${(props) => props.theme.color.grayscale20};
  border-radius: 8px;

  &:hover {
    background-color: ${(props) => props.theme.color.grayscale21};
  }

  &:hover > svg {
    opacity: 1;
  }

  ${(props) => props.$isActive && css`
    & > div {
      background: ${props.theme.color.grayscale18};
      border-radius: 4px;
    }

    &:hover svg {
      opacity: 0;
    }
  `}

  ${(props) => props.disabled && css`
    background-color: ${(props) => props.theme.color.grayscale8};

    && > div {
      background: repeating-linear-gradient(
        to bottom,
        ${(props) => props.theme.color.grayscale18} 0,
        ${(props) => props.theme.color.grayscale18} 0.2rem,
        transparent 0.2rem,
        transparent 0.4rem
      );
    }

    &&:hover {
      background-color: ${(props) => props.theme.color.grayscale17};
    }
  `}
`

export const Separator = styled.div`
  width: 0.2rem;
  height: 70%;
  opacity: 1;
  background: repeating-linear-gradient(
    to bottom,
    ${(props) => props.theme.color.primary2} 0,
    ${(props) => props.theme.color.primary2} 0.2rem,
    transparent 0.2rem,
    transparent 0.4rem
  );
  transition: all 0.3s ease;
`

export const StyledIcon = `
  position: absolute;
  opacity: 0;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  color: ${(props) => props.theme.color.primary2};
  font-size: 1.2rem;
  transition: all 0.3s ease;
`

export const StyledScissorsIcon = styled(ScissorsIcon)`
  ${StyledIcon}
  color: ${(props) => props.theme.color.primary2};
  rotate: -90deg;
`

export const StyledLockIcon = styled(LockIcon)`
  ${StyledIcon}
  color: ${(props) => props.theme.color.grayscale18};
`
