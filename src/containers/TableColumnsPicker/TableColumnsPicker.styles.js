
import styled from 'styled-components'
import { Draggable as DraggableComponent } from '@/components/Draggable'
import { Menu } from '@/components/Menu'

const Draggable = styled(DraggableComponent)`
  height: 3.2rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 1.3rem;
  border: 1px solid transparent;
  transition: all 0.3s;
`

const StyledMenuItem = styled(Menu.Item)`
  padding: 0;
  box-sizing: border-box;
  border: 1px solid transparent;

  &:hover {
    background: transparent;
  }
`

const StyledMenu = styled(Menu)`
  width: 22.8rem;
  box-sizing: border-box;
`

const StyledDivider = styled(Menu.Divider)`
  margin: 0.2rem 0;
`

export {
  StyledMenuItem,
  StyledMenu,
  StyledDivider,
  Draggable,
}
