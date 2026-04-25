
import styled from 'styled-components'
import { Draggable } from '@/components/Draggable'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  padding: 1.6rem;
  border: 1px solid ${(props) => props.theme.color.grayscale1};
  background-color: ${(props) => props.theme.color.grayscale14};
`

export const DraggableNodeItem = styled(Draggable)`
  width: 100%;
  margin: 0.8rem;

  &:hover {
    border: none;
    border-radius: 8px;
  }
`
