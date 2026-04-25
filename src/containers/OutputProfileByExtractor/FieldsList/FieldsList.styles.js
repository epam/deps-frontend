
import withScrolling from 'react-dnd-scrolling'
import styled, { css } from 'styled-components'
import { Draggable } from '@/components/Draggable'
import { List } from '@/components/List'
import { ScreenBreakpoint } from '@/enums/ScreenBreakpoint'

const ScrollingComponent = withScrolling('div')

const DraggableItem = styled(Draggable)`
  ${({ isDraggable }) => isDraggable && css`
    border: 1px solid transparent;
    
    &:hover {
      box-shadow: none;
    }
  `}
`

const ScrollingWrapper = styled(ScrollingComponent)`
  overflow-x: auto;
  padding-bottom: 0.6rem;
  padding-inline: 1.6rem;
`

const StyledList = styled(List)`
  height: auto;

  & .ant-spin-container {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    grid-template-rows: repeat(6, 1fr);
    padding-top: 0.2rem;
    padding-bottom: 1rem;
  }

  @media (min-width: ${ScreenBreakpoint.laptopXL}) {
    & .ant-spin-container {
      grid-template-rows: repeat(8, 1fr);
    }
  }

  @media (min-width: ${ScreenBreakpoint.desktop}) {
    & .ant-spin-container {
      grid-template-rows: repeat(11, 1fr);
    }
  }
`

export {
  DraggableItem,
  ScrollingWrapper,
  StyledList as List,
}
