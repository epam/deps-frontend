
import styled, { css } from 'styled-components'

const DraggableContainer = styled.div`
  ${({ theme, isDragging }) => isDragging && css`
      border: 1px dashed ${theme.color.primary2} !important;
      background: ${theme.color.grayscale6};
      & > * {
        opacity: 0;
      }
    `}

  ${({ theme, canDrag }) => canDrag && css`
      &:hover {
        box-shadow: 0 1px 0.8rem ${theme.color.grayScale8};
        border: 1px solid ${theme.color.primary2};
      }
    `}
`

export {
  DraggableContainer,
}
