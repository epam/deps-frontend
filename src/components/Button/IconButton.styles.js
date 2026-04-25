
// TODO: #2125

import styled, { css } from 'styled-components'

const IconButton = styled.button`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background-color: ${(props) => props.theme.color.primary3};
    box-shadow: 0 0 3px ${(props) => props.theme.color.primary2Lighter};
  }

  &:focus, &:active {
    outline: none;
    background-color: ${(props) => props.theme.color.primary3};
    border: 1px solid ${(props) => props.theme.color.primary2};
  }

  &[disabled] {
    pointer-events: none;
  }

  ${({ customSize }) => customSize && css`
    width: ${customSize.width};
    height: ${customSize.height};
  `}

  ${({ theme, disabled }) => disabled && css`
    &:hover {  /* stylelint-disable-line no-duplicate-selectors */
      background-color: transparent;
      box-shadow: none;
      cursor: not-allowed;
    }
    &:focus, &:active { /* stylelint-disable-line no-duplicate-selectors */
      background-color: transparent;
      border: 1px solid transparent;
    }
    svg {
      path {
        fill: ${theme.color.grayscale1Darker};
      }
    }
  `}
`

export {
  IconButton,
}
