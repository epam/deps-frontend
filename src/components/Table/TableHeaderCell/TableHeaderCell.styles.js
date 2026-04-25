
import { Resizable } from 'react-resizable'
import styled, { css } from 'styled-components'

export const StyledResizable = styled(Resizable)`
  position: relative;
  width: 100%;
  overflow: visible;
  
  ${(props) => props.$isResizing && css`
  cursor: col-resize !important;
  & * { cursor: col-resize !important; }
  `}

  & .react-resizable-handle {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1000;
    width: 1.2rem;
    height: 100%;
    cursor: col-resize;
    user-select: none;
    touch-action: none;
    background: transparent;
  }
`
