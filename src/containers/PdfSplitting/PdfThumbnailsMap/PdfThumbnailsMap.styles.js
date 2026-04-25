
import { Document as ReactPdfDocument } from 'react-pdf'
import styled, { css } from 'styled-components'
import { Draggable } from '@/components/Draggable'

export const Document = styled(ReactPdfDocument)`
  height: 100%;
  flex: 1;
  padding: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  border-radius: 8px;
  overflow: auto;
`

export const ThumbnailsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 2rem;
  overflow: auto;
  height: fit-content;
  padding: 2px 4px;

  ${(props) => props.$isActivePageViewer && css`
    width: 28rem;
    max-height: 100%;

    @media (max-width: 1250px) {
      width: 15rem;
    }
  `}
`

export const ContentWrapper = styled.div`
  display: flex;
  gap: 2.4rem;
  height: calc(100% - 3rem);
  position: relative;
`

export const Title = styled.h4`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${(props) => props.theme.color.grayscale18};
`

export const DraggableItem = styled(Draggable)`
  border: 1px solid transparent;
  z-index: 1;

  & > div {
    ${(p) => p.isDraggable && css`
      cursor: move;
    `}
  }

  ${(props) => props.isDraggable && css`
    &:hover {
      box-shadow: none;
      border: 1px solid transparent;
    }
  `}
`
