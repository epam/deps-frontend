
import styled from 'styled-components'
import { Button } from '@/components/Button'

export const IconButton = styled(Button.Icon)`
  width: 2.4rem;
  height: 2.4rem;
  line-height: 2rem;

  svg {
    path {
      fill: ${(props) => props.theme.color.grayscale19};
    }
  }

  &:hover,
  &:active {
    border: 1px solid ${(props) => props.theme.color.grayscale21};
    background-color: ${(props) => props.theme.color.grayscale20};
  }

  &:disabled {
    cursor: default;
    
    svg {
      path {
        fill: ${(props) => props.theme.color.grayscale17};
      }
    }
  }
`
