
import styled, { css } from 'styled-components'
import { Button } from './Button'

const SecondaryButton = styled(Button)`
  height: 3.2rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary2};
  border-color: ${(props) => props.theme.color.grayscale21};
  background-color: ${(props) => props.theme.color.grayscale14};

  &.ant-btn-icon-only {
    padding: 0;
  }

  ${(props) => props.icon && css`
    svg {
      path {
        fill: ${(props) => props.theme.color.primary2};
      }

      & + span {
        margin-left: 0.8rem;
      }
    }
  `}

  &&:hover {
    border-color: ${(props) => props.theme.color.primary2};
    background-color: ${(props) => props.theme.color.grayscale20};
    color: ${(props) => props.theme.color.primary2};
  }

  &&:active {
    border-color: ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.grayscale21};
    color: ${(props) => props.theme.color.primary2};
  }

  &&[disabled] {
    color: ${(props) => props.theme.color.grayscale22};
    border-color: ${(props) => props.theme.color.grayscale1};
    background: ${(props) => props.theme.color.grayscale14};

    svg {
      path {
        fill: ${(props) => props.theme.color.grayscale22};
      }
    }
  }
`

export {
  SecondaryButton,
}
