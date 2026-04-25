
import withScrolling from 'react-dnd-scrolling'
import styled, { css } from 'styled-components'
import { Draggable } from '@/components/Draggable'
import { List } from '@/components/List'

const ScrollingComponent = withScrolling('div')

const DraggableItem = styled(Draggable)`
  width: 36rem;
  height: 6.4rem;
  padding-right: 1px;
  
  ${({ isDraggable }) => isDraggable && css`
    border: 1px solid transparent;
  `}
`

const ScrollingWrapper = styled(ScrollingComponent)`
  height: 100%;
  overflow-x: auto;
`

const StyledList = styled(List)`
  height: 100%;
  padding-left: 1px;

  & .ant-spin-container {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-template-rows: repeat(8, 1fr);
    padding-top: 0.2rem;

    @media (min-height: 1080px) {
      grid-template-rows: repeat(14, 1fr);
    }

    @media (min-height: 1440px ) {
      grid-template-rows: repeat(20, 1fr);
    }

    @media (min-height: 2160px ) {
      grid-template-rows: repeat(28, 1fr);
    }
  }
`

export {
  DraggableItem,
  ScrollingWrapper,
  StyledList as List,
}
